import React, { useEffect, useState } from 'react';
import '../App.css';

function TodoList() {

    //初期配列
    const iniArray = [];

    //URLの設定
    let url = new URL("https://8q8pjzzazk.execute-api.ap-northeast-1.amazonaws.com/default/Todo_DynamoDB");
    url = url.toString();

    //stateの設定
    const [todos, setTodo] = useState(iniArray);
    const [input, setInput] = useState('')

    //fetchする関数
    const fetchData = async () => {
        await fetch(url, {mode: 'cors'})
        .then(response => response.json()
        //#endregion
        )
        .then(response => {
            setTodo(response)
            setInput('')
        })
        .catch(err => console.log(err));
    }

    //todosに更新があったらfetchする
    useEffect(()=>{
        fetchData()
    },todos);

    //入力を取得する
    const handleNewTask = (event) => {
        setInput( event.target.value )
    }

    //ボタンが押されたらPOSTするする
    const postData = async () => {
        let input_item = input
        url = new URL("?todo_item=" + input_item, url);

        //データのPOST
        await fetch(url, {
            method: "POST",
            mode: 'cors'
        })

        fetchData()
    }

    const deleteData = async (delete_item) => {

        //DELETE用URLの生成
        url = new URL("?todo_item=" + delete_item, url);

        await fetch(url, {
            method: "DELETE",
            mode: 'cors'
        })

        fetchData()
    }

    return (
        <div>
            <h1 className="h1">ToDo List</h1>
            <label>Add Task : </label>
            <input id="input_text" value={input} placeholder="Add New Task" onChange={handleNewTask}/>              
            <button className="button_submit" onClick={ postData }>登録</button>
            <ul className="list_container">
                {todos.map((todo) => (
                    <li className="list_item">
                        ・{ todo.todo_item }
                        <button className="button" onClick={() => deleteData(todo.todo_item)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
  );
}

export default TodoList;

