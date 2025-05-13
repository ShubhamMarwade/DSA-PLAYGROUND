import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  DialogActions 
} from '@mui/material';
import { 
  signInWithEmailAndPassword, 
  signInAnonymously, 
  createUserWithEmailAndPassword, updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthModal = ({ open, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Ensure latest user info is fetched
      await user.reload();
      
      const userData = {
        uid: user.uid,
        email: user.email, // Show email ID for registered users
        displayName: user.email // Set display name as email
      };
  
      onLogin(userData);
      onClose();
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };
  
  const handleGuestLogin = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
  
      const guestData = {
        uid: user.uid,
        email: "Guest", // Show 'Guest' for anonymous users
        displayName: "Guest"
      };
  
      onLogin(guestData);
      onClose();
    } catch (error) {
      alert("Guest login failed: " + error.message);
    }
  };
  
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Update profile with email instead of name
      await updateProfile(user, { displayName: email });
  
      // Reload to fetch updated data
      await user.reload();
  
      alert(`Registration successful! Welcome, ${user.email}`);
      setIsLogin(true);
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
      <DialogContent>
        {!isLogin && (
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        {isLogin ? (
          <>
            <Button onClick={handleGuestLogin}>Guest</Button>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={() => setIsLogin(false)}>Register</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsLogin(true)}>Back to Login</Button>
            <Button onClick={handleRegister}>Save</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
