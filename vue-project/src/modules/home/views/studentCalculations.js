// studentCalculations.js
export function calculateTotalStudents(students) {
      return students.length;
    }
    
    export function calculateTotalPayments(students) {
      return students.reduce((sum, student) => {
        if (student.payment && typeof student.payment === "number") {
          return sum + student.payment;
        }
        return sum;
      }, 0);
    }
    