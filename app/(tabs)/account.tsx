import { UserStats } from '@/components/pages/Account/UserStats'
import DigitalRain from '@/components/pages/Plinko/DigitalRain'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { useAuthProvider, useUserProvider } from '@/providers'
import { createAccount } from '@/supabase/api/create-account'
import { getUserData } from '@/supabase/api/get-user-data'
import { login } from '@/supabase/api/login'
import { router } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

interface LoginFormData {
 email: string
 password: string
}

interface SignupFormData {
 email: string
 username: string
 password: string
}

type FormMode = 'none' | 'login' | 'signup'

export default function AccountScreen() {
 const { user } = useAuthProvider()
 const { setUserData } = useUserProvider()
 const [formMode, setFormMode] = useState<FormMode>('none')

 const loginForm = useForm<LoginFormData>({
  defaultValues: {
   email: '',
   password: '',
  },
 })

 const signupForm = useForm<SignupFormData>({
  defaultValues: {
   email: '',
   username: '',
   password: '',
  },
 })

 const onLoginSubmit = async (data: LoginFormData) => {
  try {
   const response = await login(data.email, data.password)

   if (response instanceof Error) {
    console.log(response)
    throw new Error(response.message)
   }

   const userData = await getUserData(response.data?.user?.id)
   setUserData(userData)

   console.log('Login:', data)
  } catch (error) {
   console.error(error)
  }
 }

 const onSignupSubmit = async (data: SignupFormData) => {
  try {
   const { error } = await createAccount(
    data.email,
    data.password,
    data.username
   )
   if (error) {
    console.error(error)
   } else {
    router.replace('/')
   }
  } catch (error) {
   console.error(error)
  }
 }

 const resetForm = () => {
  setFormMode('none')
  loginForm.reset()
  signupForm.reset()
 }

 return (
  <ScrollView style={{ flex: 1 }}>
   {user ? (
    // User is logged in
    <UserStats />
   ) : (
    // User is not logged in
    <>
     {formMode === 'none' && (
      <ParallaxScrollView
       headerBackgroundColor={{ light: '#D0D0D0', dark: '#000' }}
       headerImage={<DigitalRain />}
      >
       <Button
        mode="outlined"
        style={styles.button}
        onPress={() => setFormMode('login')}
       >
        Login
       </Button>
       <Button
        mode="outlined"
        style={styles.button}
        onPress={() => setFormMode('signup')}
       >
        Signup
       </Button>
       {/* Dev Login */}
       <Button
        mode="text"
        style={styles.button}
        onPress={() => {
         setFormMode('login')
         loginForm.setValue('email', 'test@dev.com')
         loginForm.setValue('password', 'testing123')
        }}
       >
        Dev Login
       </Button>
      </ParallaxScrollView>
     )}

     {formMode === 'login' && (
      <ParallaxScrollView
       headerBackgroundColor={{ light: '#D0D0D0', dark: '#000' }}
       headerImage={<DigitalRain />}
      >
       <Controller
        control={loginForm.control}
        name="email"
        rules={{
         required: 'Email is required',
         pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
         },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
         <TextInput
          label="Email"
          mode="outlined"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={!!loginForm.formState.errors.email}
          // @ts-ignore - React Native Paper doesn't have proper types for helperText
          helperText={loginForm.formState.errors.email?.message}
         />
        )}
       />

       <Controller
        control={loginForm.control}
        name="password"
        rules={{
         required: 'Password is required',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
         <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={!!loginForm.formState.errors.password}
          // @ts-ignore - React Native Paper doesn't have proper types for helperText
          helperText={loginForm.formState.errors.password?.message}
         />
        )}
       />

       <Button
        mode="contained"
        style={styles.button}
        onPress={loginForm.handleSubmit(onLoginSubmit)}
        loading={loginForm.formState.isSubmitting}
        disabled={loginForm.formState.isSubmitting}
       >
        Login
       </Button>

       <Button onPress={resetForm}>Cancel</Button>
      </ParallaxScrollView>
     )}

     {formMode === 'signup' && (
      <>
       <Controller
        control={signupForm.control}
        name="email"
        rules={{
         required: 'Email is required',
         pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
         },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
         <TextInput
          label="Email"
          mode="outlined"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={!!signupForm.formState.errors.email}
          // @ts-ignore - React Native Paper doesn't have proper types for helperText
          helperText={signupForm.formState.errors.email?.message}
         />
        )}
       />

       <Controller
        control={signupForm.control}
        name="username"
        rules={{
         required: 'Username is required',
         minLength: {
          value: 3,
          message: 'Username must be at least 3 characters',
         },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
         <TextInput
          label="Username"
          mode="outlined"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={!!signupForm.formState.errors.username}
          // @ts-ignore - React Native Paper doesn't have proper types for helperText
          helperText={signupForm.formState.errors.username?.message}
         />
        )}
       />

       <Controller
        control={signupForm.control}
        name="password"
        rules={{
         required: 'Password is required',
         minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
         },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
         <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={!!signupForm.formState.errors.password}
          // @ts-ignore - React Native Paper doesn't have proper types for helperText
          helperText={signupForm.formState.errors.password?.message}
         />
        )}
       />

       <Button
        mode="contained"
        style={styles.button}
        onPress={signupForm.handleSubmit(onSignupSubmit)}
        loading={signupForm.formState.isSubmitting}
        disabled={signupForm.formState.isSubmitting}
       >
        Sign Up
       </Button>

       <Button onPress={resetForm}>Cancel</Button>
      </>
     )}
    </>
   )}
  </ScrollView>
 )
}

const styles = StyleSheet.create({
 headerImage: {
  color: '#808080',
  bottom: -90,
  left: -35,
  position: 'absolute',
 },
 button: {
  borderRadius: 2,
 },
 welcomeContainer: {
  padding: 20,
  alignItems: 'center',
 },
})
