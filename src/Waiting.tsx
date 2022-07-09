import { Progress } from "antd";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { ClientProps } from "./App";
import { humanizeSpeed } from "./Helpers";
import { useTasks } from "./hooks";
import "./Waiting.css";
export default function Waiting({ client }: ClientProps) {
  const [selectAll, setSelectAll] = useState(false);
  const [itemsSelected, setItemsSelected] = useImmer<any[]>([]);

  // useEffect(() => {
  //   console.log(itemsSelected);
  // }, [itemsSelected]);
  let tasks = useTasks(() => {
    return client.ready().then((client: any) => {
      return client.tellWaiting(0, 100);
    });
  }, 10);

  function handleSelectAll() {
    let allGids = tasks.map((task) => task.gid);
    console.log(allGids);
    if (!selectAll) {
      setItemsSelected(() => {
        return allGids;
      });
    } else {
      setItemsSelected(() => {
        return [];
      });
    }
    setSelectAll(!selectAll);
  }
  function handleRedownload() {
    for (let gid of itemsSelected) {
      //@ts-ignore
      client.unpause(gid);
    }
  }
  function handleDelete() {
    for (let gid of itemsSelected) {
      //@ts-ignore
      client.forceRemove(gid);
    }
  }
  function handleCheckbox(e: any, gid: string) {
    console.log(e.target.checked);
    console.log(itemsSelected);
    if (e.target.checked) {
      setItemsSelected((draft) => {
        draft.push(gid);
      });
    } else {
      let index = itemsSelected.indexOf(gid);
      setItemsSelected((draft) => {
        draft.splice(index, 1);
      });
    }
  }

  return (
    <div className="WaitingContainer">
      <div className="Header">
        <div className="buttonContainer selectAll" onClick={handleSelectAll}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>全选</span>
        </div>
        <div className="buttonContainer redownload" onClick={handleRedownload}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>恢复下载</span>
        </div>
        <div className="buttonContainer delete" onClick={handleDelete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>删除</span>
        </div>
      </div>
      <div className="Body">
        <div className="itemContainer">
          <div>文件保存路径</div>
          <div>下载速度</div>
          <div>下载进度</div>
        </div>
        {tasks.map((task, index) => {
          // if (index === 0) {
          //   console.log(task);
          // }
          let file = task.files[0];
          let name = file.path;
          let gid = task.gid;
          let percent =
            (Number(file.completedLength) / Number(file.length)) * 100;

          let percentFixed: string = percent.toFixed(2);
          let speed = task.downloadSpeed;
          let readableSpeed = humanizeSpeed(speed);
          return (
            <div className="itemContainer" key={index}>
              <div className="nameContainer">
                <input
                  type="checkbox"
                  checked={itemsSelected.includes(gid)}
                  onChange={(e) => {
                    handleCheckbox(e, gid);
                  }}
                ></input>
                <span>{name}</span>
              </div>
              <div>{readableSpeed}/s</div>
              <div>
                {" "}
                <Progress percent={Number(percentFixed)}></Progress>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
