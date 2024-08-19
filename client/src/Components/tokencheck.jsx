const isAuthenticated = async() => {
  const token = localStorage.getItem('token');

  if(!token) {
    return false;
  }
  try{
    const response = await fetch('/api/verify-token', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if(!response.ok) {
      return false;
    }

  }catch(err){
    console.log('Error verifying', err)
    return false;
  }

}

export default isAuthenticated;