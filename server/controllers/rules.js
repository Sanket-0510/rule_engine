import Rule from "../models/rules.js";
import {AST,Node} from "../utils/CreateAST.js";
import User from "../models/User.js";

const tree = new AST()
const node = new Node()


function rebuildAST(nodeObj, test){
    console.log(nodeObj, test)
    if (!nodeObj) return null;

    // Create a new Node instance with the value from the JSON object
    const node = new Node(nodeObj.value);

    // Recursively rebuild the left and right subtrees
    node.left = nodeObj.left ? rebuildAST(nodeObj.left,test) : null;
    node.right = nodeObj.right ? rebuildAST(nodeObj.right,test) : null;

    return node;
}

const createRule = async(req,res)=>{           
    const data = req.body
    const user = req.user
    try{

    //check if the user exists
    const userData = await User.findOne({where: {email: user.email}})
    const rule = data.rule
    const root = tree.createAST(rule, 0, rule.length-1)
    const convert = JSON.stringify(root)


    //data to enter in the database
    const temp = {
        user_id: userData.user_id,
        name: data.name,
        description: data.description,
        Json: convert
    }

    const newRule = await Rule.create(temp)
    res.status(201).json(newRule)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


const evaluateData = async(req,res)=>{
    const data = req.body
    const user = req.user
    try{
        const userData = await User.findOne({where: {email: user.email}})
        const rule = await Rule.findOne({where: {user_id: userData.user_id, name: data.name}})
        console.log(rule.Json)
        const parsedJSON = JSON.parse(rule.Json);
        console.log(parsedJSON)
        const root = rebuildAST(parsedJSON, "test");
        console.log(root,data.data)
        
        const result = tree.evaluate(root, data.data)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const mergeRule = async(req,res)=>{
    const data = req.body
    const user = req.user
    
    try{
        const userData = await User.findOne({where: {email: user.email}})
        const rule1 = await Rule.findOne({where: {user_id: userData.user_id, name: data.name1}})
        const rule2 = await Rule.findOne({where: {user_id: userData.user_id, name: data.name2}})
        const operator = data.operator
        const newRule = JSON.stringify(tree.mergeRule(rule1, rule2, operator))
        const newRuleData = {
            user_id: userData.user_id,
            name: data.name,
            description: data.description,
            Json: newRule
        }
        const result = await Rule.create(newRuleData)
        res.status(201).json(result)
    }catch(error){
        res.status(500).json({ error: error.message })
    }

}


export { createRule, evaluateData, mergeRule }