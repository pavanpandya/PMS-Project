// ** React Imports
import { ReactNode, useState } from 'react'

// ** login api
import { login } from '../../../@core/utils/ajax/login'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Button, CardContent, TextField, Typography } from '@mui/material'

// toastify
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LoginPage = () => {
  // ** State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // ** Hook
  const theme = useTheme()

  const router = useRouter()

  //role based login
  const roleBasedLogin = (role: string) => {
    if (role === 'admin') {
      router.push('/admin/dashboard/student')
    } else if (role === 'student') {
      router.push('/student/dashboard/home')
    } else {
      router.push('/faculty/dashboard/home')
    }
  }

  // ** Function to handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await login({ email, password })
    const response = result
    console.log(response)
    if (result.success === true) {
      toast.success('Login Successfull', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
    if (response.message === 'Please change your password by calling /api/users/change-password') {
      router.push('/changePassword')
    } else if (result.success) {
      roleBasedLogin(result.message.role)
      localStorage.setItem('name', result.message.name)
    } else {
      // setError(result.message)
      toast.error(result.error, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.log(result)
    }
  }

  return (
    <Box className='content-center'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Same as */}
      <ToastContainer />
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(8, 7, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width={35}
              height={29}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                  <g id='logo' transform='translate(95.000000, 50.000000)'>
                    <path
                      id='Combined-Shape'
                      fill={theme.palette.primary.main}
                      d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                      transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                      transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.15'
                      fill={theme.palette.common.white}
                      d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.35'
                      fill={theme.palette.common.white}
                      transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                      d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                    />
                  </g>
                </g>
              </g>
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account </Typography>
          </Box>
          <Box>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label='Email'
                  variant='outlined'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Password'
                  variant='outlined'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  margin='normal'
                />
                {error && <p>{error}</p>}
                <Button type='submit' variant='contained' color='primary' fullWidth>
                  Login
                </Button>
              </form>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
