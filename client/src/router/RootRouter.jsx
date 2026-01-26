import {Route, RouterProvider , createBrowserRouter , createRoutesFromChildren} from 'react-router-dom';

import VideoProcess from '../pages/VideoProcess';
import Home from '../pages/Home';

function RootRouter() {

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path='/' element={ <Home /> } />
        <Route path='/video/tools' element={<VideoProcess />} />
      </>
    )
  )


  return(
    <RouterProvider router={router}/>
  )
}

export default RootRouter