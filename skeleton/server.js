const express = require('express')
const randomId = require('random-id')
const app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  port = 8080
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const cors = require('cors')({ origin: true })

// place holder for the data
let tasks = [
  {
    id: 1,
    task: 'task1',
    assignee: 'assignee1000',
    status: 'completed'
  },
  {
    id: 2,
    task: 'task2',
    assignee: 'assignee1001',
    status: 'completed'
  },
  {
    id: 3,
    task: 'task3',
    assignee: 'assignee1002',
    status: 'completed'
  },
  {
    id: 4,
    task: 'task4',
    assignee: 'assignee1000',
    status: 'completed'
  }
]

app.use(bodyParser.json())
app.use(helmet())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {}))
app.use('/swagger.json', (req, res) => {
  fs.readFile('./swagger.json', (err, json) => {
    if (err) {
      throw err
    }
    res.json(JSON.parse(json))
  })
})

app.get('/api/todos', (req, res) => {
  console.log('api/todos called!!!!!')
  res.json(tasks)
})

app.post('/api/todo', (req, res) => {
  const task = req.body.task
  task.id = randomId(10)
  tasks.push(task)
  res.json(tasks)
})

app.delete('/api/todo/:id', (req, res) => {
  console.log('Id to delete:::::', req.params.id)
  tasks = tasks.filter((task) => task.id != req.params.id)
  res.json(tasks)
})

app.put('/api/todos/:id', (req, res) => {
  console.log('Id to update:::::', req.params.id)
  const taskToUpdate = req.body.task
  tasks = tasks.map((task) => {
    if (task.id == req.params.id) {
      task = taskToUpdate
      task.id = parseInt(req.params.id)
    }
    return task
  })
  res.json(tasks)
})

app.get('/', (req, res) => {
  res.send(`<h1>API Running on port ${port}</h1>`)
})

/* CORS */
app.all('*', async (req, res, next) => {
  cors(req, res, async () => {
    // console.log(req)
    return next()
  })
})

app.listen(port, () => {
  console.log(`Server listening on the port::::::${port}`)
})
