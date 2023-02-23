import { HandPalm, Play } from "phosphor-react";
import {HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { createContext, useEffect, useState } from "react";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import * as zod from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, FormProvider } from "react-hook-form";



interface Cycle{
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface ClyclesContextData{
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds:number) => void;
  amountSecondsPassed: number;
}
export const CyclesContext = createContext({} as ClyclesContextData)

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})


type newCycleFormData = zod.infer<typeof newCycleValidationSchema>

export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues:{
    task:'',
    minutesAmount: 0
    }
  });

  const {handleSubmit, watch, reset} = newCycleForm
  const activeCycle = cycles.find(cycle => cycle.id == activeCycleId);

  function markCurrentCycleAsFinished(){
    setCycles(state => state.map((cycle) => {
      if (cycle.id == activeCycleId){
        return{...cycle, interruptedDate: new Date()}
      } else {
        return cycle
      }
    }),)
  }

  function setSecondsPassed(seconds: number){
      setAmountSecondsPassed(seconds);
  }

  function handleCreateNewCycle(data:newCycleFormData){
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
        id: id,
        task: data.task,
        minutesAmount: data.minutesAmount,
        startDate: new Date()
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
    reset();
  }

  function handleInterruptCycle(){
    setActiveCycleId(null);

    setCycles(state => state.map((cycle) => {
      if (cycle.id == activeCycleId){
        return{...cycle, interruptedDate: new Date()}
      } else {
        return cycle
      }
    }),) 
  }



  const task = watch('task');
  const isSubmitDisabled = !task;


 

  return (
  <HomeContainer>
    <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
    <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}}>
      <FormProvider {...newCycleForm}>
        <NewCycleForm/>
      </FormProvider>
      <Countdown />
    </CyclesContext.Provider>
    {activeCycle ? (
      <StopCountdownButton type="button" onClick={() => handleInterruptCycle}>
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
 