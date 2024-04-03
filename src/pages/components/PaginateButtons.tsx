import React from "react"

export const PaginateButtons: React.FunctionComponent<{disabled:boolean, value:string, pageValue:number, handlePageChange:Function}> = ({disabled, value, pageValue, handlePageChange}:{disabled:boolean, value:string, pageValue:number, handlePageChange:Function})=>{

    return (
        <span><button key={value+pageValue} style={disabled?{border:'2px solid grey', padding:'2px', margin:'3px'}: {border:'2px solid blue', padding:'2px', margin:'3px', color:'blue'}} disabled={disabled} onClick={e=>handlePageChange(pageValue)}>{value}</button></span>
    )
}