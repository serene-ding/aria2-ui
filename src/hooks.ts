import { useCallback, useEffect, useState } from "react"
export function useInput(init: any) {
  var [value, setValue] = useState(init);
  var [checked, setChecked] = useState(init);

  function onChange(e: any) {
    let target = e.target
    if (target !== null) {
      if (target.type === "checkbox" || target.type === "radio") {
        setChecked(target.checked);
      } else {
        setValue(target.value);
      }



    }

  }

  function clear() {
    setValue("");
  }

  var ret = {
    value,
    checked,
    clear: useCallback(clear, []),
    onChange: useCallback(onChange, [])
  };

  Object.defineProperty(ret, "clear", {
    value: useCallback(clear, [])
  });

  return ret;
}
export function useTasks(getTasks: () => Promise<any[]>, interval: number) {

  let [tasks, setTasks] = useState<any[]>([])
  // console.log("useTasks")
  useEffect(() => {

    let id = setInterval(() => {
      getTasks().then(tasks => {

        setTasks(tasks)

      })
    }, interval)
    return () => {

      clearInterval(id)
    }
  }, [])
  return tasks
}