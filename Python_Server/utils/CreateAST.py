import re

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class AST:

    def create_ast(self, rule, starting_index, ending_index):
        stack = []
        main_operator_index = -1

        # If there are outer parentheses, strip them
        for i in range(starting_index, ending_index + 1):
            if rule[i] == '(':
                stack.append('(')
            elif rule[i] == ')':
                stack.pop()
            else:
                # Check for operators when not inside parentheses
                if len(stack) == 0:
                    # Look for "AND"
                    if rule[i:i + 3] == 'AND':
                        main_operator_index = i
                        break  # Break at first AND found
                    # Look for "OR"
                    if rule[i:i + 2] == 'OR':
                        main_operator_index = i
                        break  # Break at first OR found

        # If we found an operator, split the rule around it
        left = None
        right = None
        if main_operator_index != -1:
            operator = rule[main_operator_index:main_operator_index + 3].strip()
            if operator != 'AND':
                operator = rule[main_operator_index:main_operator_index + 2].strip()

            # Create left and right AST nodes recursively
            if rule[main_operator_index - 1] == ')':
                left = self.create_ast(rule, starting_index + 1, main_operator_index - 3)
            else:
                left = self.create_ast(rule, starting_index, main_operator_index - 2)

            if rule[main_operator_index + 1] == '(':
                right = self.create_ast(rule, main_operator_index + len(operator) + 2, ending_index - 1)
            else:
                right = self.create_ast(rule, main_operator_index + len(operator) + 1, ending_index)  # Move index past operator

            root_node = Node(operator)
            root_node.left = left
            root_node.right = right
            return root_node

        # If no operator is found, check for outer parentheses
        if rule[starting_index] == '(' and rule[ending_index] == ')':
            return self.create_ast(rule, starting_index + 1, ending_index - 1)

        # If no operator and no parentheses, return the leaf node
        return Node(rule[starting_index:ending_index + 1].strip())  # Return as is

    def evaluate_condition(self, condition, data):
        # condition might be something like "age > 30"
        print(condition)
        match = re.match(r"(\w+)\s*(>|<|=|<=|>=|!=)\s*('?[^']+'?)", condition)
        if not match:
            return False

        variable, operator, value = match.groups()
        variable_value = data.get(variable.strip())

        # Convert to correct types if needed (e.g., number or string)
        parsed_value = value.strip()
        if parsed_value.isnumeric():
            parsed_value = float(parsed_value)
        else:
            parsed_value = parsed_value.replace("'", "")  # remove quotes if string

        # Evaluate based on the operator
        if operator == '>':
            return variable_value > parsed_value
        elif operator == '<':
            return variable_value < parsed_value
        elif operator == '>=':
            return variable_value >= parsed_value
        elif operator == '<=':
            return variable_value <= parsed_value
        elif operator == '=':
            return variable_value == parsed_value
        elif operator == '!=':
            return variable_value != parsed_value
        return False

    def evaluate(self, node, data):
        if not node:
            return False

        # If it's a leaf node (operand)
        if node.left is None and node.right is None:
            return self.evaluate_condition(node.value, data)

        # Evaluate left and right nodes recursively
        left_result = self.evaluate(node.left, data)
        right_result = self.evaluate(node.right, data)

        # Apply the operator
        if node.value == 'AND':
            return left_result and right_result
        elif node.value == 'OR':
            return left_result or right_result

        return False

    def rebuild_ast(self, node_obj):
      if not node_obj:
          return None
  
      # Handle cases where 'value' might not exist
      node_value = node_obj.get('value') or node_obj.get('name')
      if not node_value:
          raise ValueError(f"Invalid node structure: {node_obj}")
  
      # Create a new Node instance with the extracted value
      node = Node(node_value)
  
      # Handle 'left' and 'right' or recursively process 'children'
      if 'left' in node_obj and 'right' in node_obj:
          node.left = self.rebuild_ast(node_obj.get('left'))
          node.right = self.rebuild_ast(node_obj.get('right'))
      elif 'children' in node_obj:
          children = node_obj['children']
          if len(children) == 2:  # Assuming binary tree structure
              node.left = self.rebuild_ast(children[0])
              node.right = self.rebuild_ast(children[1])
  
      return node


    def merge_rule(self, node1, node2, merger_condition):
        node = Node(merger_condition)
        node.left = node1
        node.right = node2
        return node

    def print_tree(self, node):
        if not node:
            return  # Base condition to stop recursion if the node is null

        print(node.value)  # Print the value of the current node

        # Recursively traverse the left and right subtrees
        self.print_tree(node.left)
        self.print_tree(node.right)

    def transform_tree(self, node):
        if not node:
            return None

        return {
            'name': node.value,
            'children': [
                self.transform_tree(node.left),
                self.transform_tree(node.right)
            ]
        }
    
    def transform_tree_into_dict(self, node):
        if not node:
            return None

        # Return the tree as a dictionary that can be converted into JSON
        return {
            'value': node.value,
            'left': self.transform_tree_into_dict(node.left),
            'right': self.transform_tree_into_dict(node.right)
        }

