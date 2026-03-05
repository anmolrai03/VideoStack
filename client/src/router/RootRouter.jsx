import {Route, RouterProvider , createBrowserRouter , createRoutesFromChildren} from 'react-router-dom';

import Layout from '../Layout';

import VideoProcess from '../pages/VideoProcess';
import Home from '../pages/Home/Home';
import Auth from '../pages/Auth/Auth';

import Test from '../pages/Test';

function RootRouter() {

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        
        <Route path='/video/tools' element={<VideoProcess />} />
        

        <Route path='/' element={<Layout />}>
          <Route index element={ <Home /> } />
          <Route path='test' element={ <Test /> } />
        </Route>

        <Route path='/auth' element={<Auth />} />
      </>
    )
  )


  return(
    <RouterProvider router={router}/>
  )
}

export default RootRouter