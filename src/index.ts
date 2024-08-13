import express, {Request, Response} from 'express'

const app = express();
const port = 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

const db = {
  courses: [
    { id: 1, title: 'frontend' },
    { id: 2, title: 'backend' },
    { id: 3, title: 'automaton qa' },
    { id: 4, title: 'devops' },
  ],
  coursesLastId: 4
}

app.get('/', (req: Request, res: Response) => {
  res.json('main');
})

app.get('/courses', (req: Request, res: Response) => {

  let foundCourses = db.courses;

  if (req.query.title) {
    foundCourses = foundCourses.filter(el => el.title.indexOf(req.query.title as string) > -1);
  }
  res.json(foundCourses)
})

app.get('/courses/:id', (req: Request, res: Response) => {
  const foundedCourse = db.courses.find(el => el.id === Number(req.params.id))

  if (!foundedCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  res.json(foundedCourse)
})

app.post('/courses', (req: Request, res: Response) => {
  if(!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const createdCourse = {
    id: ++db.coursesLastId,
    title: req.body.title
  }
  db.courses.push(createdCourse);
  res.json(createdCourse);
})

app.delete('/courses/:id', (req: Request, res: Response) => {
  db.courses = db.courses.filter(el => el.id !== Number(req.params.id));
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/courses/:id', (req: Request, res: Response) => {
  if(!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const foundedCourse = db.courses.find(el => el.id === Number(req.params.id))

  if (!foundedCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  foundedCourse.title = req.body.title;

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})