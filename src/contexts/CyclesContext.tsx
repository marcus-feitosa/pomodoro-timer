import { createContext, ReactNode, useReducer, useState } from "react";

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
  interface CyclesContextProviderProps{
    children: ReactNode
}
interface CyclesState{
    cycles: Cycle[]
    activeCycleId: string | null
}

export const CyclesContext = createContext({} as ClyclesContextData);



export function CylesContextProvider({children} : CyclesContextProviderProps){
    const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {

        if(action.type == 'ADD_NEW_CYCLE'){
            return {
                ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycle.id,
            }
        }

        if(action.type == 'INTERRUPT_CYCLE'){
            return{
                ...state,
                cycles: state.cycles.map((cycle) => {
                    if (cycle.id == state.activeCycleId){
                        return{...cycle, interruptedDate: new Date()}
                    } else {
                        return cycle
                    }
                    }),
                activeCycleId: null, 
            }
        }
        return state
    }, {
        cycles: [],
        activeCycleId: null,
    })


  
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const {cycles, activeCycleId} = cyclesState;

    const activeCycle = cycles.find(cycle => cycle.id == activeCycleId);

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds);
    }

    
    function markCurrentCycleAsFinished(){
        dispatch({
            type: 'MARCK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                data: activeCycleId,
            },
        });
        
    }

    function createNewCycle(data:CreateCycleData){
        const id = String(new Date().getTime());
        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            },
        });
        /* setCycles((state) => [...state, newCycle]) */
        
        setAmountSecondsPassed(0);
      }
    
      function interruptCycle(){
        dispatch({
            type: 'INTERRUPT_CYCLE',
            payload: {
                data: activeCycleId,
            },
        });
         /* setCycles(state => state.map((cycle) => {
          if (cycle.id == activeCycleId){
            return{...cycle, interruptedDate: new Date()}
          } else {
            return cycle
          }
        }),)  */
      }
    
  
    return(
        <CyclesContext.Provider value={{cycles, activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed, createNewCycle, interruptCycle}}>
            {children}
        </CyclesContext.Provider>
    )
} 