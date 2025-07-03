import {
  Fields,
  OutgoingBody,
  OutgoingResponse,
  ResponseOutparam,
} from "wasi:http/types@0.2.0";

export function ReponseBuilder() {
  return {
    headers: new Fields(),
    statusCode: 200,
    body: undefined,
    setHeader: function (key, value) {
      this.headers.set(key, [new TextEncoder().encode(value)]);
    },
    setStatusCode: function (statusCode) {
      this.statusCode = statusCode;
    },
    setBody: function (body) {
      this.body = body;
    },
    send: function (resp) {
      const response = new OutgoingResponse(this.headers);
      response.setStatusCode(this.statusCode);
      const outgoingBody = response.body();
      {
        const outputStream = outgoingBody.write();
        outputStream.write(new Uint8Array(new TextEncoder().encode(this.body)));
        outputStream.flush();
        outputStream[Symbol.dispose]();
      }

      OutgoingBody.finish(outgoingBody, undefined);
      ResponseOutparam.set(resp, { tag: "ok", val: response });
      return response;
    },
  };
}

export function parseHeaders(headers) {
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const output = {};
  for (const [key, value] of headers.entries()) {
    const headerName = key;
    const headerValue = decoder.decode(value);
    if (headerValue) {
      if (!output[headerName]) {
        output[headerName] = [headerValue];
      } else {
        output[headerName].push(headerValue);
      }
    }
  }
  return output;
}

export function parseBody(req) {
  const requestBody = [];
  const stream = req.consume();
  while (true) {
    try {
      const chunk = stream.stream().read(4096n);
      if (!chunk || chunk.length === 0) {
        break;
      }

      requestBody.push(chunk);
    } catch (e) {
      if (e.payload.tag === "closed") {
        // Stream is closed, we can stop reading
        break;
      }
      throw new Error(`Failed to read from request stream: ${e}`);
    }
  }

  return requestBody;
}

export function buildResponse(body, statusCode, contentType) {
  const builder = ReponseBuilder();
  builder.setHeader("Content-Type", contentType);
  builder.setStatusCode(statusCode);
  builder.setBody(body);
  return builder;
}

export function buildResponseHtml(body, statusCode) {
  const builder = ReponseBuilder();
  builder.setHeader("Content-Type", "text/html; charset=utf-8");
  builder.setStatusCode(statusCode);
  builder.setBody(body);
  return builder;
}
