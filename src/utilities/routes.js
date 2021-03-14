import AdminsPage from '../pages/admins'
import HomePage from '../pages/home'
import NewPage from '../pages/new'
import PasswordPage from '../pages/password'
import QuestionAddPage from '../pages/question_add'
import QuestionEditPage from '../pages/question_edit'
import QuestionViewPage from '../pages/question_view'
import SeriesQuizEditPage from '../pages/series_quiz'
import ViewPage from '../pages/view'

export default [
  {
    path: '/admins',
    page: AdminsPage
  },
  {
    path: '/password',
    page: PasswordPage
  },
  {
    path: '/new/question',
    page: QuestionAddPage
  },
  {
    path: '/new/:department',
    page: NewPage
  },
  {
    path: '/view/question',
    page: QuestionViewPage
  },
  {
    path: '/view/:department',
    page: ViewPage
  },
  {
    path: '/edit/question',
    page: QuestionEditPage
  },
  {
    path: '/edit/:department',
    page: SeriesQuizEditPage
  },
  {
    path: '/',
    page: HomePage
  }
]
