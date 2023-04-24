// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined'
import RecentActorsOutlinedIcon from '@material-ui/icons/RecentActorsOutlined'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import PeopleOutlinedIcon from '@material-ui/icons/PeopleOutlined'
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined'
import CalendarViewDayOutlinedIcon from '@material-ui/icons/CalendarViewDayOutlined'
import DeveloperBoardOutlinedIcon from '@material-ui/icons/DeveloperBoardOutlined'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  let role
  if (typeof window !== 'undefined') {
    role = localStorage.getItem('role')
  }

  let AssinedProject
  if (typeof window !== 'undefined') {
    AssinedProject = localStorage.getItem('projectIsAssigned')
  }

  let token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }

  // ** Student Items

  const studentItems = [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/student/dashboard/home'
    },
    {
      title: 'Profile',
      icon: AccountBoxOutlinedIcon,
      path: '/account-settings/'
    }
  ]

  if (AssinedProject === 'yes') {
    studentItems.push(
      {
        title: 'Project',
        icon: DeveloperBoardOutlinedIcon,
        path: '/student/dashboard/project'
      },
      {
        title: 'Group',
        icon: PeopleOutlinedIcon,
        path: '/student/dashboard/group'
      },
      {
        title: 'Submission',
        icon: CalendarViewDayOutlinedIcon,
        path: '/student/dashboard/submission'
      },
      {
        title: 'KanBan',
        icon: DeveloperBoardOutlinedIcon,
        path: '/student/dashboard/kanban'
      }
    )
  } else {
    studentItems.length = 2 // remove all but the first two tabs
  }

  //admin items
  const adminItems = [
    {
      title: 'Student',
      icon: HomeOutline,
      path: '/admin/dashboard/student'
    },
    {
      title: 'Faculty',
      icon: AccountBoxOutlinedIcon,
      path: '/admin/dashboard/faculty'
    },
    {
      title: 'Student CSV',
      icon: RecentActorsOutlinedIcon,
      path: '/admin/dashboard/studentCsv'
    },
    {
      title: 'Faculty CSV',
      icon: RecentActorsOutlinedIcon,
      path: '/admin/dashboard/facultyCsv'
    },
    {
      title: 'Add Student ',
      icon: AddBoxOutlinedIcon,
      path: '/admin/dashboard/addStudent'
    },
    {
      title: ' Add Faculty ',
      icon: AddBoxOutlinedIcon,
      path: '/admin/dashboard/addFaculty'
    }
  ]

  //faculty items
  const facultyItems = [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/faculty/dashboard/home'
    },
    {
      title: 'Profile',
      icon: AccountBoxOutlinedIcon,
      path: '/account-settings/'
    },
    {
      title: 'Groups',
      icon: PeopleOutlinedIcon,
      path: '/faculty/dashboard/groups'
    },
    {
      title: 'Request',
      icon: BallotOutlinedIcon,
      path: '/faculty/dashboard/request'
    }
  ]

  let items
  if (role === 'student') {
    items = studentItems
  } else if (role === 'admin') {
    items = adminItems
  } else if (role === 'faculty') {
    items = facultyItems
  }

  return [
    {
      sectionTitle: 'Pages'
    },
    ...(items || []) // Use the spread operator and a default empty array to ensure items is iterable
  ]
}

export default navigation
