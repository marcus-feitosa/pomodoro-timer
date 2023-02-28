import { HandPalm, Play } from "phosphor-react";
import {HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { createContext, useContext, useEffect, useState } from "react";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import * as zod from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { CyclesContext } from "../../contexts/CyclesContext";






const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})


type newCycleFormData = zod.infer<typeof newCycleValidationSchema>

export function Home() {
  const{createNewCycle, activeCycle, interruptCycle} = useContext(CyclesContext)
 
  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues:{
    task:'',
    minutesAmount: 0
    }
  });

  const {handleSubmit, watch, reset} = newCycleForm

 
  function handleCreateNewCycle(data : newCycleFormData){
    createNewCycle(data);
    reset();
  }
  const task = watch('task');
  const isSubmitDisabled = !task;


 

  return (
  <HomeContainer>
    <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
      <FormProvider {...newCycleForm}>
        <NewCycleForm/>
      </FormProvider>
      <Countdown />
    {activeCycle ? (
      <StopCountdownButton type="button" onClick={interruptCycle}>
      <HandPalm size={24}/>
      Interromper
      </StopCountdownButton>
    ):<StartCountdownButton disabled={isSubmitDisabled} type="submit">
      <Play size={24}/>
      Começar
      </StartCountdownButton>}
    </form>
  </HomeContainer>
    )
}
 