class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class AST {

    createAST(rule, startingIndex, endingIndex) {
        let stack = [];
        let mainOperatorIndex = -1;

        // If there are outer parentheses, strip them
       

        for (let i = startingIndex; i <= endingIndex; i++) {
            if (rule[i] === '(') {
                stack.push('(');
            } else if (rule[i] === ')') {
                stack.pop();
            } else {
                // Check for operators when not inside parentheses
                if (stack.length === 0) {
                    // Look for "AND"
                    if (rule.slice(i, i + 3) === 'AND') {
                        mainOperatorIndex = i;
                        break; // Break at first AND found
                    }
                    // Look for "OR"
                    if (rule.slice(i, i + 2) === 'OR') {
                        mainOperatorIndex = i;
                        break; // Break at first OR found
                    }
                }
            }
        }

        // If we found an operator, split the rule around it
        let left = null;
        let right = null;
        if (mainOperatorIndex !== -1) {
            let operator = rule.slice(mainOperatorIndex, mainOperatorIndex + 3).trim();
            if (operator !== 'AND') operator = rule.slice(mainOperatorIndex, mainOperatorIndex + 2).trim();

            // Create left and right AST nodes recursively
            if (rule[mainOperatorIndex-1]==')')  left = this.createAST(rule, startingIndex+1, mainOperatorIndex - 3);
            else left = this.createAST(rule, startingIndex, mainOperatorIndex - 2);
            
            if (rule[mainOperatorIndex+1]=='(') right = this.createAST(rule, mainOperatorIndex + operator.length + 2, endingIndex-1);
            else right = this.createAST(rule, mainOperatorIndex + operator.length+1, endingIndex); // Move index past operator

            let rootNode = new Node(operator);
            rootNode.left = left;
            rootNode.right = right;
            return rootNode;
        }

        // If no operator is found, check for outer parentheses
        if (rule[startingIndex] === '(' && rule[endingIndex] === ')') {
            return this.createAST(rule, startingIndex + 1, endingIndex - 1);
        }

        // If no operator and no parentheses, return the leaf node
        return new Node(rule.slice(startingIndex, endingIndex + 1).trim()); // Return as is
    }
    
    evaluateCondition(condition, data) {
        // condition might be something like "age > 30"
        console.log(condition)
        const match = condition.match(/(\w+)\s*(>|<|=|<=|>=|!=)\s*('?[^']+'?)/);
        if (!match) return false;

        const [_, variable, operator, value] = match;
        const variableValue = data[variable.trim()];

        // Convert to correct types if needed (e.g., number or string)
        let parsedValue = value.trim();
        if (!isNaN(parsedValue)) parsedValue = parseFloat(parsedValue);
        else parsedValue = parsedValue.replace(/'/g, ''); // remove quotes if string

        // Evaluate based on the operator
        switch (operator) {
            case '>': return variableValue > parsedValue;
            case '<': return variableValue < parsedValue;
            case '>=': return variableValue >= parsedValue;
            case '<=': return variableValue <= parsedValue;
            case '=': return variableValue === parsedValue;
            case '!=': return variableValue !== parsedValue;
            default: return false;
        }
    }

    // Recursive function to evaluate the AST
    evaluate(node, data) {
        if (!node) return false;

        // If it's a leaf node (operand)
        if (node.left === null && node.right === null) {
            return this.evaluateCondition(node.value, data);
        }

        // Evaluate left and right nodes recursively
        const leftResult = this.evaluate(node.left, data);
        const rightResult = this.evaluate(node.right, data);

        // Apply the operator
        if (node.value === 'AND') {
            return leftResult && rightResult;
        } else if (node.value === 'OR') {
            return leftResult || rightResult;
        }

        return false;
    }

    rebuildAST(nodeObj, test){
        console.log(nodeObj, test)
        if (!nodeObj) return null;
    
        // Create a new Node instance with the value from the JSON object
        const node = new Node(nodeObj.value);
    
        // Recursively rebuild the left and right subtrees
        node.left = nodeObj.left ? rebuildAST(nodeObj.left,test) : null;
        node.right = nodeObj.right ? rebuildAST(nodeObj.right,test) : null;
    
        return node;
    }

}

export {AST, Node}




// Usage example
// const jsonString = '{"value":"AND","left":{"value":"OR","left":{"value":"age > 30","left":null,"right":null},"right":{"value":"department = Sales","left":null,"right":null}},"right":{"value":"OR","left":{"value":"salary > 50000","left":null,"right":null},"right":{"value":"experience > 5","left":null,"right":null}}}';
// const parsedJSON = JSON.parse(jsonString);
// const rootNode = rebuildAST(parsedJSON);
// console.log(JSON.stringify(rootNode, null, 2));

// Example usage
// const expression = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
// const ast = new AST();
// const root = ast.createAST(expression, 0, expression.length - 1);

// Output the AST structure


// Evaluate the expression
// const data = {
//     age: 30,
//     department: 'Sales',
//     salary: 60000,
//     experience: 3
// };
// const result = ast.evaluate(rootNode, data);

// console.log(result); // true



// Output the AST structure




// class AST {
//     constructor() {
//         this.root = null;
//     }
//     stack = [];
//     createAST(rule, startingIndex, endingIndex, stack) {
//         // AST creation logic

        
//         let root = null;
//         if (rule[startingIndex] === '(' && rule[endingIndex] === ')') {
//             for (let i = startingIndex; i <= endingIndex; i++) {
//                 if (rule[i] === 'A') {
//                     root = new Node(rule.slice(i, i + 3));
//                     root.left = new Node (rule.slice(startingIndex, i-2));
//                     root.right = new Node (rule.slice(i+1, endingIndex));
//                 } else if (rule[i] === 'O') {
//                     root = new Node(rule.slice(i, i + 2));
//                     root.left = new Node (rule.slice(startingIndex, i-2));
//                     root.right = new Node (rule.slice(i+1, endingIndex));
//                 }
//             }
//         }

//         //base case

//         for (let i = 0; i < rule.length; i++) {

//             if (rule[i] === '(') {
//                 stack.push('(');
//             } 
//             if (rule[i] === ')') {
//                stack.pop();
//             } 


//             if(stack.length === 0){
//                 if(rule[i]=='A'){
//                     root = new Node(rule.slice(i,i+3));
//                 }
//                 else if(rule[i]=='O'){ 
//                     root = new Node(rule.slice(i,i+2));
//                 }
//                 root.left = new createAST(rule, startingIndex+1, i-2, stack);
//                 root.right = new createAST(rule, i+1, endingIndex, stack);
//             }


//         }
//     ;
//     }


// }