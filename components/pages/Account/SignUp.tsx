import { StyleSheet, useColorScheme } from 'react-native'

import { Controller, useForm } from 'react-hook-form'
import { TextInput as PaperTextInput } from 'react-native-paper'

import DigitalRain from '@/components/pages/Plinko/DigitalRain'
import { Button } from '@/components/PaperBase/Button'
import { TextInput } from '@/components/PaperBase/TextInput'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import MatrixButton from '@/components/shared/MatrixButton'
import { createTheme } from '@/constants/Colors'
import { createAccount } from '@/supabase/api/create-account'

interface SignupFormData {
 email: string
 username: string
 password: string
}

const SignUp = ({
 setFormMode,
}: {
 setFormMode: (mode: 'none' | 'login' | 'signup') => void
}) => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 const signupForm = useForm<SignupFormData>({
  defaultValues: {
   email: '',
   username: '',
   password: '',
  },
 })

 const onSignupSubmit = async (data: SignupFormData) => {
  try {
   const { error } = await createAccount(
    data.email,
    data.password,
    data.username
   )
   if (error) {
    throw new Error(error.message)
   } else {
    // router.push('/')
   }
  } catch (error) {
   console.error(error)
  }
 }

 const resetForm = () => {
  setFormMode('none')
  signupForm.reset()
 }

 return (
  <ParallaxScrollView
   headerBackgroundColor={{
    light: theme.colors.matrixDarkBG,
    dark: theme.colors.surface,
   }}
   headerImage={<DigitalRain />}
  >
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
      left={<PaperTextInput.Icon icon="email" />}
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
      left={<PaperTextInput.Icon icon="account" />}
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
      left={<PaperTextInput.Icon icon="lock" />}
      // @ts-ignore - React Native Paper doesn't have proper types for helperText
      helperText={signupForm.formState.errors.password?.message}
     />
    )}
   />

   <MatrixButton
    title=" [ SIGN UP ]"
    onPress={signupForm.handleSubmit(onSignupSubmit)}
    loading={signupForm.formState.isSubmitting}
    // disabled={signupForm.formState.isSubmitting}
   />

   <Button onPress={resetForm}>Cancel</Button>
  </ParallaxScrollView>
 )
}

export default SignUp

const styles = StyleSheet.create({})
