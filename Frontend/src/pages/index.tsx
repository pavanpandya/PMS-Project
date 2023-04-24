// ** React Imports
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

const Home = () => {
  const router = useRouter()
  const handleLogin = () => {
    router.push('/pages/login')
  }

  return (
    <>
      <Box className='content-center'>
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
              ></svg>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography>Welcome to the Student Management System</Typography>
              <Button onClick={handleLogin}>Login</Button>
            </Box>
            <Box></Box>
          </CardContent>
        </Card>
        <FooterIllustrationsV1 />
      </Box>
    </>
  )
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
