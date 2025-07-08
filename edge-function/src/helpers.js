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
      // create a new response
      const response = new OutgoingResponse(this.headers);
      // set the status code
      response.setStatusCode(this.statusCode);
      // get the body
      const outgoingBody = response.body();
      {
        // write the body to the response
        const outputStream = outgoingBody.write();
        // write the body to the response
        outputStream.write(new Uint8Array(new TextEncoder().encode(this.body)));
        // flush the response per wasi spec
        outputStream.flush();
        // dispose of the response
        outputStream[Symbol.dispose]();
      }

      // finish the response
      OutgoingBody.finish(outgoingBody, undefined);
      // set the response in the response outparam
      ResponseOutparam.set(resp, { tag: "ok", val: response });
      // return the response
      return response;
    },
  };
}

export function parseHeaders(headers) {
  const decoder = new TextDecoder("utf-8", { fatal: false }); //create a decoder to decode the headers
  const output = {};
  for (const [key, value] of headers.entries()) {
    // for each header, decode the value
    const headerName = key;
    const headerValue = decoder.decode(value);
    if (headerValue) {
      // if the header is not in the output, add it
      if (!output[headerName]) {
        output[headerName] = [headerValue];
      } else {
        // if the header is already in the output, add the value to the array
        output[headerName].push(headerValue);
      }
    }
  }
  // return the output
  return output;
}

/**
 * Parse the body of the request into a Uint8Array
 * @param {Request} req
 * @returns {Uint8Array}
 */
export function parseBody(req) {
  const requestBody = [];
  // consume the request body
  const stream = req.consume();
  while (true) {
    try {
      // read the request body in chunks of 4096 bytes
      const chunk = stream.stream().read(4096n);
      // if the chunk is empty, break the loop
      if (!chunk || chunk.length === 0) {
        break;
      }
      // add the chunk to the request body
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
  return buildResponse(body, statusCode, "text/html; charset=utf-8");
}
