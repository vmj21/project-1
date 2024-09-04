function recalculateFinalAverages() {
  
    var rows = document.querySelectorAll('#gradesTable tr:not(:first-child)');
    
    
    rows.forEach(function (row) {
        var total = 0; // Initializes total marks
        var count = 0; // Initializes count of valid marks
        var cells = row.querySelectorAll('td'); // Select all cells in the row
        
        
        cells.forEach(function (cell, index) {
            var value = parseInt(cell.innerText.trim()); // Get the value as int
            if (!isNaN(value) && value >= 0 && value <= 100) {
                total += value; // Add  value to total
                count++;
            }
        });
        
        var average = Math.round(total / count);
        
        cells[cells.length - 1].innerText = average + '%';
        
        if (average < 60) {
            row.classList.add('below-sixty'); 
        } else {
            row.classList.remove('below-sixty'); // Remove the CSS class if the average is 60% or above
        }
        
    });
}


function countUnsubmittedAndStyle() {
    var unsubmittedCount = 0; // count of unsubmitted assignments
    var rows = document.querySelectorAll('#gradesTable tr:not(:first-child)'); // Select rows not the header row
    
    rows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        
        cells.forEach(function (cell) {
            if (cell.innerText.trim() === '-') {
                unsubmittedCount++; // count of unsubmitted assignments
                cell.classList.add('unsubmitted'); 
            } else {
                cell.classList.remove('unsubmitted'); 
            }
        });
    });
    

    document.getElementById('unsubmittedCount').innerText = 'Total unsubmitted assignments: ' + unsubmittedCount;
}


function validateCellData(cell) {
    var value = parseInt(cell.innerText.trim()); // Get the value from the cell and parse it as an integer
    
    // Check if the value is not a valid number between 0 and 100
    if (isNaN(value) || value < 0 || value > 100) {
        cell.innerText = '-'; // Replace the cell content with "-"
    }
}

// event listener 
document.querySelectorAll('#gradesTable td[contenteditable="true"]').forEach(function (cell) {
    cell.addEventListener('input', function () {
        validateCellData(cell); // Call the function to validate cell data
        recalculateFinalAverages(); // Call the function to recalculate final grade averages
        countUnsubmittedAndStyle(); // Call the function to count unsubmitted assignments and style cells
    });
});


recalculateFinalAverages();
countUnsubmittedAndStyle();

// Function for average to American letter grade
function convertToLetterGrade(average) {
    if (average >= 93) return 'A';
    else if (average >= 90) return 'A-';
    else if (average >= 87) return 'B+';
    else if (average >= 83) return 'B';
    else if (average >= 80) return 'B-';
    else if (average >= 77) return 'C+';
    else if (average >= 73) return 'C';
    else if (average >= 70) return 'C-';
    else if (average >= 67) return 'D+';
    else if (average >= 63) return 'D';
    else if (average >= 60) return 'D-';
    else return 'F';
}

// Function for average to American 4.0 grade
function convertToGrade4(average) {
    if (average == 'A') return 4.0;
    else if (average === 'A-') return 3.7;
    else if (average === 'B+') return 3.3;
    else if (average === 'B') return 3.0;
    else if (average === 'B-') return 2.7;
    else if (average === 'C+') return 2.3;
    else if (average ==='C+') return 2.0;
    else if (average ==='C-') return 1.7;
    else if (average === 'D+') return 1.3;
    else if (average === 'D') return 1.0;
    else if (average  === 'D-') return 0.7;
    else if (average === 'F' ) return 0.0;
    else return 0.0;
}

// Function for toggle representation
function toggleAveragePresentation() {
    var rows = document.querySelectorAll('#gradesTable tr:not(:first-child)');
    
    rows.forEach(function (row) {
        var cells = row.querySelectorAll('td:last-child');
        cells.forEach(function (cell) {
            var currentRepresentation = cell.getAttribute('data-representation');
            var average = parseInt(cell.innerText.replace('%', ''));

            switch (currentRepresentation) {
                case 'percent':
                    // Converting the average to American letter grade
                    var letterGrade = convertToLetterGrade(average);
                    cell.innerText = letterGrade;
                    cell.setAttribute('data-representation', 'letter');
                    break;
                case 'letter':
                    // Converting the average to American 4.0 grade
                    var grade4 = convertToGrade4(average);
                    cell.innerText = grade4.toFixed(1); // Display one decimal place
                    cell.setAttribute('data-representation', 'grade4');
                    break;
                case 'grade4':
                    // Show average as percentage
                    cell.innerText = average + '%';
                    cell.setAttribute('data-representation', 'percent');
                    break;
                default:
                    break;
            }
        });
    });

}

var averageHeader = document.getElementById('averageHeader');
averageHeader.addEventListener('click', function() {
    toggleAveragePresentation();
});

// new table row 
document.getElementById('insertRowBtn').addEventListener('click', function() {
    var newRow = document.createElement('tr');
    newRow.innerHTML = '<td>New Data</td><td>New Data</td><td>New Data</td>';
    
    //  Editing of cells in row 
    newRow.querySelectorAll('td').forEach(function(cell) {
        cell.contentEditable = true;
        
        //Event listener for inputing intoe each cell
        cell.addEventListener('input', function() {
            validateCellData(cell); 
            recalculateFinalAverages(); 
            countUnsubmittedAndStyle(); 
        });
    });
    
    document.getElementById('gradesTable').appendChild(newRow);
    
    recalculateFinalAverages(); // Recalculate final grade averages for the new row
    countUnsubmittedAndStyle(); // Count unsubmitted assignments and style cells for the new row
});



document.getElementById('insertColumnBtn').addEventListener('click', function() {
    var headerRow = document.querySelector('#gradesTable tr:first-child');
    var newHeaderCell = document.createElement('th');
    newHeaderCell.textContent = 'New Column Title';

    var averageCellIndex = -1;
    headerRow.querySelectorAll('th').forEach(function(cell, index) {
        if (cell.textContent.trim() === 'Average %') {
            averageCellIndex = index;
        }
    });

    headerRow.insertBefore(newHeaderCell, headerRow.cells[averageCellIndex + 1]);

    var rows = document.querySelectorAll('#gradesTable tr');
    rows.forEach(function(row, index) {
        var newCell = document.createElement('td');
        if (index === 0) { // If it's the header row
            newCell.textContent = 'New Data';
            newCell.contentEditable = true; 
        } else { // If it's not the header row
            newCell.textContent = '0'; 
        }
        row.insertBefore(newCell, row.cells[averageCellIndex + 1]);

    });
});



function savePreviousData() {
    previousTableData = document.getElementById('gradesTable').innerHTML;
}


function retrievePreviousData() {
    // Check if previous data exists
    if (previousTableData !== '') {
        // Replacing current table data with previous data
        document.getElementById('gradesTable').innerHTML = previousTableData;

        document.querySelectorAll('#gradesTable td[contenteditable="true"]').forEach(function(cell) {
            cell.addEventListener('input', function() {
                validateCellData(cell);
                recalculateFinalAverages();
                countUnsubmittedAndStyle();
            });
        });
        recalculateFinalAverages();
        countUnsubmittedAndStyle();
    } else {
        console.log('No previous data available.');
    }
}

// Listener for saving previous data
document.getElementById('saveDataBtn').addEventListener('click', function() {
    savePreviousData();
});

//Listener for retrieving previous data
document.getElementById('retrieveDataBtn').addEventListener('click', function() {
    retrievePreviousData();
});

function toggleRowSelection(row) {
    row.classList.toggle('selected'); // Toggle the 'selected' class for the row
}


document.querySelectorAll('#gradesTable tr:not(:first-child)').forEach(function (row) {
    row.addEventListener('click', function () {
        if (this !== document.querySelector('#gradesTable tr:first-child')) {
            toggleRowSelection(this);
        }
    });
});



function toggleColumnSelection(columnIndex) {
    var rows = document.querySelectorAll('#gradesTable tr');
    rows.forEach(function (row) {
        var cells = row.cells;
        cells[columnIndex].classList.toggle('selected'); 
    });
}

    // Listener for column selection
document.querySelectorAll('#gradesTable th:not(:last-child)').forEach(function (headerCell, columnIndex) {
    headerCell.addEventListener('click', function () {
        if (this !== document.querySelector('#gradesTable th:last-child')) {
            toggleColumnSelection(columnIndex);
        }
    });
});




function deleteSelectedRow() {
    var selectedRow = document.querySelector('#gradesTable tr.selected');
    if (selectedRow) {
        selectedRow.remove(); 
        recalculateFinalAverages(); 
    }
}

//Listener for row deletion
document.getElementById('deleteRowBtn').addEventListener('click', function () {
    deleteSelectedRow(); // Calling  function to delete selected row
});


function deleteSelectedColumn(columnIndex) {
    document.querySelectorAll('#gradesTable tr').forEach(function (row) {
        row.cells[columnIndex].remove(); 
    });
    recalculateFinalAverages(); 
}

//Listener for column deletion
document.getElementById('deleteColumnBtn').addEventListener('click', function () {
    var columnIndexToDelete = prompt('Enter the index of the column to delete:');
    if (columnIndexToDelete) {
        deleteSelectedColumn(parseInt(columnIndexToDelete));
    }
});

