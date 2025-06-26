'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PassThrough } from 'stream';
import {z} from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6,"Password must be at least 6 characters long")
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginForm(){
   
   const [isLoading,setIsLoading] = useState(false);
   const router = useRouter();

   // initialise form
   const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: ''
      }
   })

   async function onSubmitHandler(values:LoginFormValues){
     setIsLoading(true);
     try {
      const {data,error} = await signIn.email({
         email: values.email,
         password: values.password,
         rememberMe: true,
      })

      if(error){
      toast('Login Failed!');    
      setIsLoading(false);
      return;
      }
      console.log(data);
      
      toast('Login Success');
      router.push("/");
      
     } catch (error) {
      console.log(error);
     }finally{
      setIsLoading(false);
     }
   }

   return (
   <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmitHandler)} className='space-y-4'>

    <FormField
    control={form.control}
    name='email'
    render={({field})=>(
      <FormItem>
         <FormLabel>Email</FormLabel>
         <FormControl>
            <Input placeholder="Enter your email" {...field}/>
         </FormControl>
         <FormMessage/>
      </FormItem>
    )}
    />

    <FormField
    control={form.control}
    name='password'
    render={({field})=>(
      <FormItem>
         <FormLabel>Password</FormLabel>
         <FormControl>
            <Input type="password" placeholder='Enter your password' {...field}/>
         </FormControl>
         <FormMessage/>
      </FormItem>
    )}
    />

   <Button type='submit' className='w-full' disabled={isLoading}> 
         {isLoading ? "Signing in..." : "Sign in"}
   </Button>   

    </form>
   </Form>
   )
}

export default LoginForm;