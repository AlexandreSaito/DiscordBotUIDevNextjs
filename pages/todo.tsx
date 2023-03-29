import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const todo = [
  {
    name: "todo list",
    list: [
      { name: "make functional", done: true },
      { name: "prettyfy", done: true },
    ],
  },
  {
    name: "discord",
    list: [
      { name: "auth", done: false },
      {
        name: "voice",
        done: true,
        sub: [
          { name: "connect", done: true },
          { name: "connect (via web)", done: true },
          { name: "disconnect", done: true },
          { name: "disconnect (via web)", done: true },
          { name: "change TTS language", done: false },
          { name: "change TTS language (via web)", done: true },
          { name: "change TTS volume", done: false },
          { name: "change TTS volume (via web)", done: true },
          { name: "change music volume", done: false },
          { name: "change music volume (via web)", done: true },
        ],
      },
      {
        name: "default channels",
        done: true,
        sub: [
          { name: "change default text", done: false },
          { name: "change default text (via web)", done: true },
          { name: "change default music", done: false },
          { name: "change default music (via web)", done: true },
        ],
      },
      {
        name: "custom messages",
        done: true,
        sub: [
          { name: "use custom message", done: true },
          { name: "change messages (via web)", done: true },
        ],
      },
      {
        name: "custom audio",
        done: true,
        sub: [
          { name: "play custom audio", done: false },
          { name: "add custom audio", done: false },
          { name: "add custom audio (via web)", done: false },
          { name: "delete custom audio", done: false },
          { name: "delete custom audio (via web)", done: false },
          { name: "edit custom audio (via web)", done: false },
        ],
      },
      {
        name: "music",
        sub: [
          { name: "play (by YT URL)", done: true },
          { name: "play (by Playlist)", done: false },
          { name: "display current music (via web)", done: true },
          { name: "add music to queue", done: false },
          { name: "add music to queue (via web)", done: false },
          { name: "add playlist to queue", done: false },
          { name: "add playlist to queue (via web)", done: true },
          { name: "resume", done: false },
          { name: "resume (via web)", done: false },
          { name: "pause", done: false },
          { name: "pause (via web)", done: false },
          { name: "stop", done: false },
          { name: "stop (via web)", done: false },
        ],
      },
      {
        name: "playlist",
        sub: [
          { name: "show list", done: false },
          { name: "show list (via web)", done: true },
          { name: "create", done: false },
          { name: "create (via web)", done: true },
          { name: "edit", done: false },
          { name: "edit (via web)", done: true },
          { name: "delete", done: false },
          { name: "detele (via web)", done: true },
          { name: "add music", done: false },
          { name: "add music (via web)", done: true },
          { name: "remove music", done: false },
          { name: "remove music (via web)", done: true },
          { name: "change music order (via web)", done: false },
        ],
      },
      {
        name: "commands",
        sub: [
          { name: "dont active disabled", done: true },
          { name: "enable/disable", done: false },
          { name: "enable/disable (via web)", done: true },
          { name: "permission to call by user", done: false },
          { name: "permission to call by role", done: false },
          {
            name: "add/edit permissions to call",
            done: false,
            sub: [
              { name: "by default", done: false },
              { name: "by default (via web)", done: true },
              { name: "by role", done: false },
              { name: "by role (via web)", done: false },
              { name: "by user", done: false },
              { name: "by user (via web)", done: false },
            ],
          },
        ],
      },
    ],
  },
];

function getTodoItem(index, item) {
  index.i++;
  let sub = null;
  let itemDone = item.done;
  let i = index.i;
  if (item.sub) {
    itemDone = item.sub.find((x) => !x.done) == undefined;
    let itens = [];
    for (let j = 0; j < item.sub.length; j++) {
      itens.push(getTodoItem(index, item.sub[j]));
    }
    sub = <ul className="list-group">{itens}</ul>;
  }

  let className = `list-group-item ${
    itemDone ? "list-group-item-success" : ""
  }`;

  return (
    <li key={i} className={className}>
      <input
        className="form-check-input me-1"
        type="checkbox"
        checked={itemDone}
        readOnly
      />
      {item.name}
      {sub}
    </li>
  );
}

const Page: NextPage = () => {
  let list = [];
  let index = { i: 0 };
  for (let i = 0; i < todo.length; i++) {
    let todos = [];
    for (let j = 0; j < todo[i].list.length; j++) {
      todos.push(getTodoItem(index, todo[i].list[j]));
    }
    list.push(
      <div key={i}>
        <h3>{todo[i].name}</h3>
        <ul className="list-group">{todos}</ul>
      </div>
    );
  }

  return (
    <>
      <h1>TO DO</h1>
      {list}
    </>
  );
};

export default Page;
