import { message } from "antd";
import { useNavigate } from "react-router";
import { EventEmitter } from "events";
export default class Aria2Client extends EventEmitter {
  ip: string;
  port: number | string;
  secret: string;
  ws: WebSocket;
  id: number;
  first: boolean;
  readyPromise: Promise<Aria2Client>;
  callbacks: {
    [id: number]: (data: any) => void;
  };
  constructor(
    ip: string = "127.0.0.1",
    port: number | string,
    secret: string,
    first: boolean = false
  ) {
    super();
    this.ip = ip;
    this.port = port;
    this.secret = secret;
    this.first = first;
    this.id = 0;

    let url = `ws://${this.ip}:${this.port}/jsonrpc`;
    this.ws = new WebSocket(url);
    this.callbacks = {};
    let aria2Client = this;
    // 收到服务器回应

    this.ws.addEventListener("message", function (e) {
      //在这里得到服务器回应的data

      let data = JSON.parse(e.data);
      let id = data.id;
      if (id !== undefined) {
        let callback = aria2Client.callbacks[id];
        delete aria2Client.callbacks[id];
        callback(data);
      } else {
        let eventName = data.method.slice(8);
        console.log(eventName);

        aria2Client.emit(eventName, ...data.params);
      }
    });

    // websocket建立连接
    this.readyPromise = new Promise((resolve, reject) => {
      this.ws.addEventListener("open", (e) => {
        console.log("open", e);
        message.success("已经成功建立连接🧐");

        resolve(this);
      });
      this.ws.addEventListener("error", (e) => {
        console.log("error", e);
        if (!first) {
          message.error("连接建立失败😶 ");
        }

        reject(this);
      });
    });
  }
  // addUri(...args: any[]) {
  //     return new Promise((resolve,reject) =>{
  //         let id = this.id
  //         this.id++
  //         function callback(data:any){
  //             if(data.error){
  //                 reject(data.error)
  //             }else{
  //                 resolve(data.result)
  //             }
  //         }
  //         this.callbacks[id] = callback
  //         this.ws.send(
  //         JSON.stringify(
  //             {
  //               jsonrpc: "2.0",
  //               id:id,
  //               method: "aria2.addUri",
  //               params: [`token:${this.secret}`,...args]
  //             }
  //         )
  //         )
  //     })

  // }
  // listMethods(...args: any[]) {
  //     return new Promise((resolve,reject) =>{
  //         let id = this.id
  //         this.id++
  //         function callback(data:any){
  //             if(data.error){
  //                 reject(data.error)
  //             }else{
  //                 resolve(data.result)
  //             }
  //         }
  //         this.callbacks[id] = callback
  //         this.ws.send(
  //         JSON.stringify(
  //             {
  //               jsonrpc: "2.0",
  //               id:id,
  //               method: "system.listMethods",

  //             }
  //         )
  //         )
  //     })

  // }
  ready() {
    return this.readyPromise;
  }
}
let aria2Method: string[] = [
  "aria2.addUri",
  "aria2.addTorrent",
  "aria2.getPeers",
  "aria2.addMetalink",
  "aria2.remove",
  "aria2.pause",
  "aria2.forcePause",
  "aria2.pauseAll",
  "aria2.forcePauseAll",
  "aria2.unpause",
  "aria2.unpauseAll",
  "aria2.forceRemove",
  "aria2.changePosition",
  "aria2.tellStatus",
  "aria2.getUris",
  "aria2.getFiles",
  "aria2.getServers",
  "aria2.tellActive",
  "aria2.tellWaiting",
  "aria2.tellStopped",
  "aria2.getOption",
  "aria2.changeUri",
  "aria2.changeOption",
  "aria2.getGlobalOption",
  "aria2.changeGlobalOption",
  "aria2.purgeDownloadResult",
  "aria2.removeDownloadResult",
  "aria2.getVersion",
  "aria2.getSessionInfo",
  "aria2.shutdown",
  "aria2.forceShutdown",
  "aria2.getGlobalStat",
  "aria2.saveSession",
  "system.multicall",
  "system.listMethods",
  "system.listNotifications",
];
aria2Method.forEach((prefixedMethodName) => {
  let [, methodName] = prefixedMethodName.split(".");

  //@ts-ignore
  Aria2Client.prototype[methodName] = function (...args: any[]) {
    // console.log("args","method",args,methodName)
    return new Promise((resolve, reject) => {
      let id = this.id;

      this.id++;
      function callback(data: any) {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      }
      this.callbacks[id] = callback;
      this.ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: id,
          method: prefixedMethodName,
          params: ["token:111222333", ...args],
        })
      );
    });
  };
});
