import React, { useState, useRef } from 'react';
import './App.css';

export default () => {
    const inputEl = useRef(null);
    const state = {},
        setFn = {},
        set = (key, val) => {
            if (Array.isArray(state[key]))
                setFn[key](old => { return val(old) });
            else if (typeof state[key] === 'string' || state[key] instanceof String)
                setFn[key](val);
        };
    let val = localStorage.getItem('tarefa');
    try {
        val = JSON.parse(val);
    } catch (e) { };
    [state.tarefa, setFn.tarefa] = useState(val);
    val = localStorage.getItem('lista');
    try {
        val = JSON.parse(val);
    } catch (e) { };
    [state.lista, setFn.lista] = useState(val);
    const saveToLocal = () => {
        Object.keys(state).forEach((key) => {
            if (!localStorage.hasOwnProperty(key))
                return;
            Object.keys(state).forEach((key) => localStorage.setItem(key, JSON.stringify(state[key])));
        });
    };
    window.addEventListener(
        'beforeunload',
        saveToLocal
    );
    const dom = {
        update: (val) => {
            set('tarefa', (() => val));
        },
        add: () => {
            set('lista', ((old) => {
                return [...old, {
                    id: 1 + Math.random(),
                    val: state.tarefa.slice()
                }]
            }));
            set('tarefa', (() => ''));
            inputEl.current.focus();
        },
        del: (id) => {
            set('lista', ((old) => {
                return old.filter(item => item.id !== id)
            }));
        }
    };
    return (
        <div id="to-do">
            <div>
                <input
                    ref={inputEl}
                    type="text"
                    placeholder="Adicione uma tarefa"
                    value={state.tarefa}
                    onChange={e => dom.update(e.target.value)} />
                <button
                    className="add"
                    onClick={() => dom.add()}
                    disabled={!state.tarefa.length}>
                    <span className="add">+</span>
                </button>
            </div>
            <ul>
                {state.lista.map(item => {
                    return (
                        <li key={item.id}>
                            <span>{item.val}</span>
                            <button onClick={() => dom.del(item.id)}>
                                <span>&times;</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};