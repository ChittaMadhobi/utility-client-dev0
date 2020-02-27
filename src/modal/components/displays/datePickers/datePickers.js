import React, { Component } from "react";

class datePickers extends Component {
  state = {};

  render() {
    return (
      <>
   

      <form method="post" className="container ">
        {/* <div className="container"> */}
        <div className="d-flex flex-row">    

        <div className="form-group col-sm-4"> 
        <div className="row">    
          <label className="control-label col-sm-4" for="date">Start Date:</label>
          <input className="form-control col-sm-4" id="date" name="date" placeholder="MM/DD/YYY" type="text"/>
        </div>
        </div>
      
        <div className="form-group col-sm-4 "> 
        <div className="row">    
          <label className="control-label col-sm-4" for="date">End Date:</label>
          <input className="form-control col-sm-4" id="date" name="date" placeholder="MM/DD/YYY" type="text"/>
        </div>
        </div>

        <div className="form-group col-sm-2 "> 
          <button className="btn btn-primary " name="submit" type="submit">Submit</button>
        </div>
        {/* </div> */}
        </div>

     </form>



      </>
    );
  }
}

export default datePickers;
