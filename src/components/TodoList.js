import React, { useEffect, useState } from 'react';
import '../App.css';

function TodoList() {

    //初期配列
    const iniArray = [];

    //URLの設定
    let url = new URL("http://127.0.0.1:8000/api/items/");
    url = url.toString();

    //stateの設定
    const [todos, setTodo] = useState(iniArray);
    const [input, setInput] = useState('')

    //fetchする関数
    const fetchData = async () => {
        await fetch(url)
        .then(response => response.json())
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

        //POSTする内容の作成
        const body_text = JSON.stringify({
            item: input,
        });

        //データのPOST
        await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: body_text,                        
        })

        fetchData()
    }

    const deleteData = async (id) => {

        //DELETE用URLの生成
        let urlDel = url + id;
        console.log(urlDel)

        await fetch(urlDel, {
            method: "DELETE",
            headers: {"Content-Type": "application/json",},
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
                        ・{ todo.item }
                        <button className="button" onClick={() => deleteData(todo.id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
  );
}

export default TodoList;