// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Fetch } from "js/connection";
import { getUrls } from "js/discord/url";

type DiscordBot = {
  guild: string;
  url: string;
};

type Data = {
  alert: string;
  message: string;
  data: null | undefined | Array<DiscordBot>;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userTag = req.body.userTag;
  if (!userTag.includes("#")) {
    res
      .status(200)
      .json({ alert: "danger", message: "User TAG está no formato incorreto" });
    return;
  }
  const tagSplitted = userTag.split("#");
  const userName = tagSplitted[0];
  const userDif = parseInt(tagSplitted[1]);
  if (isNaN(userDif)) {
    res
      .status(200)
      .json({ alert: "danger", message: "User TAG está no formato incorreto" });
    return;
  }

  const botUrlList = getUrls();
  let promisses = [];
  for (let i = 0; i < botUrlList.length; i++) {
    promisses.push(
      new Promise((resolve, reject) => {
        const url = botUrlList[i];
        Fetch(`${url}/discord/get-user-by-tag`, { body: { userTag: userTag } })
          .then((x) => {
            return x.json();
          })
          .then((x) => {
            resolve({ id: i + 1, url: url, res: x });
          })
          .catch((error) => {
            resolve(null);
          });
      })
    );
  }

  Promise.all(promisses).then((values) => {
    const discords = values.filter((x) => x);
    res.status(200).json({ alert: "success", data: discords });
  });
}
