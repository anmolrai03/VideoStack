import {Navigate} from "react-router-dom";

import { useAuthContext } from '../contexts/AuthContext/AuthContext';

function ProtectedRoute({children}) {
  const {authChecked, user} = useAuthContext();

  if(!authChecked) {
    return <div>loading....</div>
  }

  if( !user ){
    return <Navigate to="/auth"></Navigate>
  }

  return children;
}

export default ProtectedRoute