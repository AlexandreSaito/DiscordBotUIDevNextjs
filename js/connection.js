import { fetchEventSource } from "@microsoft/fetch-event-source";

var botUrl;

const sse = [];

function parseMessage(res) {
  res.data = JSON.parse(res.data);
  return res;
}

export async function registerSSE(
  url,
  { method, header, body, onOpen, onClose, onMessage, onError }
) {
  console.log("SSE", url, sse);
  if (sse.find((x) => x.url == url)) {
    return false;
  }

  if (!header) header = {};
  sse.push({
    url: url,
    fetch: fetchEventSource(
      `${url}?discordId=${body.discordID}&discordGuild=${body.discordGuild}`,
      {
        method: method,
        headers: {
          ...header,
          "content-type": "application/json",
          cache: "no-cache",
        },
        onopen: onOpen,
        onmessage: (res) => {
          onMessage(parseMessage(res));
        },
        onclose: onClose,
        onerror: onError,
        fetch: (url, rest) => {
          return fetch(url, {
            method: rest.method,
            referrerPolicy: "no-referrer",
            keepalive: true,
            body: JSON.stringify(body),
            headers: { accept: rest.headers.Accept },
          });
        },
      }
    ),
  });
}

export function setBotUrl(url) {
  if (!botUrl) {
    botUrl = url;
    console.log(botUrl);
  }
}

export function getBotUrl() {
  return botUrl;
}

export function FetchDiscord(url, header, onDone) {
  if (!botUrl) return null;
  //console.log(botUrl);
  if (!onDone) return Fetch(`${botUrl}${url}`, header);
  Fetch(`${botUrl}${url}`, header)
    .then((x) => {
      return x.json();
    })
    .then((x) => {
      onDone(x);
    });
}

export function FetchResponse(url, header, onDone) {
  Fetch(url, header)
    .then((x) => {
      return x.json();
    })
    .then((x) => {
      onDone(x);
    });
}

export function Fetch(url, header) {
  if (!header) header = {};
  if (!header.method) header.method = "POST";
  if (!header.headers) header.headers = {};

  if (header.isFormData) {
    delete header.isFormData;
  } else {
    if (!header.headers["Content-Type"])
      header.headers["Content-Type"] = "application/json";
    if (!header.cache) header.cache = "default";

    if (header.body)
      if (typeof header.body == "object")
        header.body = JSON.stringify(header.body);
  }

  return fetch(url, header);
}
