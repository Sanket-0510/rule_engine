

const getUserProfile = async (req, res) => {
    try {
        const user = req.user
        const userData = await User.findOne({ where: { email: user.email } })
        res.status(200).json(userData)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
}

const getUserRules = async (req, res) => {
    try {
        const user = req.user
        const userData = await User.findOne({ where: { email: user.email } })
        const rules = await Rule.findAll({ where: { user_id: userData.user_id } })
        res.status(200).json(rules)
    }catch(error){
        res.status(500).json({ error: error.message })
    }
}


export { getUserProfile, getUserRules }