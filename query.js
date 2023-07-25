export const studentInfoData = `
query {
    user {
      id
      login
    }
    }
    `
export const studentXpChart = (id) => `
    query {
    transaction(where:{userId:{_eq:${id}},type:{_eq:"xp"},eventId:{_eq:20}}){
      path
      amount
      type
      createdAt
      objectId
    }
  }`
// get all projects under school curriculum
export const schoolProjects =`
query {
    object(where:{name:{_eq:"School Curriculum"}}){
        id
        name
    }
}
`
// get project object by id
export const objectById = (id) =>`
query {
    object(where:{id:{_eq: ${id}}}){
        id
        name
        }
    }
`
// get api for child projects by parent id
export const childProjects = (id) => `
query {
    object_child(where:{parentId:{_eq: ${id}}}){
        id
        parentId
        childId
        }
    }`;
// get api for basic-skill 
export const studentBasicSkill = (id) => `
query{
    transaction(where:{userId:{_eq:${id}},type:{_regex:"skill"}}){
        path
    	amount
    	type
        objectId	
    }
  }
`
//get api for student personal info
export const userInfoData = (id) => `
query{
	user(where:{id:{_eq:${id}}}){
 attrs
    auditRatio
  }
}`