import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "./layout";
import { NextPageWithLayout } from "./../../_app";
import { DiscordContext } from "context/discord";

const Home: NextPageWithLayout = (a) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);

  return <></>;
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
