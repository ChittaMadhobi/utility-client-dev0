import React, { Component } from 'react';
import './logTable.css'

class LogTable extends Component {
    render() {
        return (
            <>

              <table className="table table-hover">
                  <thead className="thead-dark">
                  <tr>
                      <th>Error ID</th>
                      <th>Program Name</th>
                      <th>Message Type</th>
                      <th>Date</th>
                      <th>Message</th>
                      <th>Details</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                      <td>test</td>
                      <td>test</td>
                      <td>test</td>
                      <td>test</td>
                      <td>test</td>
                      <td>test</td>
                  </tr>
                  </tbody>
              </table>

            </>
        );
    }
}

export default LogTable;