import { createContext, ReactNode, useState } from "react";

interface CreateCycleData{
    task: string;
    minutesAmount: number;
}
interface Cycle{
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
  }
  
interface ClyclesContextData{
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds:number) => void;
    amountSecondsPassed: number;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCycle: () => void;
  }

export const CyclesContext = createContext({} as ClyclesContextData);

interface CyclesContextProviderProps{
    children: ReactNode
}

export function CylesContextProvider({children} : CyclesContextProviderProps){
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const activeCycle = cycles.find(cycle => cycle.id == activeCycleId);

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds);
    }

    
    function markCurrentCycleAsFinished(){
        setCycles(state => state.map((cycle) => {
        if (cycle.id == activeCycleId){
            return{...cycle, interruptedDate: new Date()}
        } else {
            return cycle
        }
        }),)
    }

    function createNewCycle(data:CreateCycleData){
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
      }
    
      function interruptCycle(){
        setActiveCycleId(null);
    
        setCycles(state => state.map((cycle) => {
          if (cycle.id == activeCycleId){
            return{...cycle, interruptedDate: new Date()}
          } else {
            return cycle
          }
        }),) 
      }
    
  
    return(
        <CyclesContext.Provider value={{cycles, activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed, createNewCycle, interruptCycle}}>
            {children}
        </CyclesContext.Provider>
    )
}