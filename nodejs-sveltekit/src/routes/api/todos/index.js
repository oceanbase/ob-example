import { oceanbaseConnection } from '../../../lib/db/oceanbase';

export async function get() {
    let results = await oceanbaseConnection
        .query('SELECT * FROM tasks')
        .then(function ([rows, fields]) {
            console.log(rows);
            return rows;
        });

    return {
        body: results,
    };
}
export async function post(request) {
    console.log(request);
    const { text, completed } = request.body;
    let newTask = await oceanbaseConnection
        .query('INSERT INTO tasks (text, completed) VALUES (?, ?)', [
            text,
            completed,
        ])
        .then(function ([result]) {
            return { id: result.insertId, text: text, completed: completed };
        });
    return {
        body: newTask,
    };
}
