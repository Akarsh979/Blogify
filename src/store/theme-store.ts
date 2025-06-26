'use client'

import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface ThemeState{
   isDarkMode : boolean,
   toggletheme : ()=>void,
}

export const useThemeStore = create<ThemeState>()(
   persist( 
      (set)=>{
         return {
            isDarkMode: false,
            toggletheme: ()=>{
               return set((state)=>({isDarkMode: !state.isDarkMode}))
            }
         }
      },
      {
         name: "theme-storage",
      }
   )
);

// Note: The persist middleware from Zustand automatically saves your store’s state to local storage (or another storage) and restores it when your app reloads.