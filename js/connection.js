export function FetchDiscord(url, header, onDone) {
  if (!onDone)
    return Fetch(`https://discordBotVDev.alexandres18.repl.co${url}`, header);
  Fetch(`https://discordBotVDev.alexandres18.repl.co${url}`, header)
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
