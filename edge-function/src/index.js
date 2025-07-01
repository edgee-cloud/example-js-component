import { ResponseOutparam, OutgoingBody, OutgoingResponse, Fields, } from "wasi:http/types@0.2.0";
const index = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Coming Soon</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100vh;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 400px;
      padding: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    footer {
      font-size: 0.9rem;
      color: #888;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Coming Soon</h1>
    <p>We're working hard to launch something awesome. Stay tuned!</p>
    <footer>Served by <a href="https://www.edgee.cloud">Edgee</a></footer>
  </div>
</body>
</html>
`;
function handle(req, resp) {
    const outgoingResponse = new OutgoingResponse(new Fields());
    outgoingResponse.setStatusCode(200);
    let outgoingBody = outgoingResponse.body();
    {
        let outputStream = outgoingBody.write();
        outputStream.write(new Uint8Array(new TextEncoder().encode(index)));
        outputStream.flush();
        // @ts-ignore: need to drop the stream according to WASI spec
        outputStream[Symbol.dispose]();
    }
    OutgoingBody.finish(outgoingBody, undefined);
    ResponseOutparam.set(resp, { tag: 'ok', val: outgoingResponse });
}
export const incomingHandler = {
    handle,
};
