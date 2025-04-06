const mongoose = require('mongoose');
const User = require('../models/User');
const ResearchPaper = require('../models/ResearchPaper');
require('dotenv').config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:OvpIVRbKRSH92ZQW@cluster0.hymysuv.mongodb.net/dtu-research-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Arrays of sample data
const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Biotechnology'];
const userTypes = ['faculty', 'student', 'researchScholar'];
const journalNames = ['IEEE Transactions', 'ACM Computing Surveys', 'Nature', 'Science', 'Journal of Applied Physics', 'Advanced Materials'];
const authorTypes = ['First Author', 'Corresponding Author', 'Co-author'];
const indexingTypes = ['Scopus', 'Web of Science', 'PubMed', 'IEEE Xplore'];
const publishers = ['Elsevier', 'Springer', 'Wiley', 'IEEE', 'ACM'];
const banks = ['SBI', 'HDFC', 'ICICI', 'PNB', 'Axis Bank'];
const paperStatuses = ['Submitted', 'authorshipConfirmationPending', 'underReview', 'approved', 'rejected'];
const awardCategories = ['OUTSTANDING', 'PREMIER', 'COMMENDABLE'];

// Helper function to generate random data
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomBool = () => Math.random() > 0.5;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Generate sample users
const generateUsers = async (count = 10) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = `User${i+1}`;
    const lastName = `Last${i+1}`;
    const name = `${firstName} ${lastName}`;
    const email = `user${i+1}@dtu.ac.in`;
    
    const user = new User({
      name,
      email,
      userType: getRandomElement(userTypes),
      applicantBiography: `Biography for ${name}`,
      applicantPhoto: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i+1}.jpg`,
      department: getRandomElement(departments),
      employeeId: `EMP${10000 + i}`,
      mobileNumber: `9${getRandomInt(100000000, 999999999)}`,
      password: '$2a$10$XdI.a48fVZ/FpZQqtgZnIOy2AxO.T9Pv0cID/voNzxljHzEQQV3rW', // hashed 'password123'
      dateOfBirth: getRandomDate(new Date(1970, 0, 1), new Date(2000, 0, 1)),
      address: `${getRandomInt(1, 999)} Street, Delhi`,
      bankAccount: `${getRandomInt(10000000000, 99999999999)}`,
      bankName: getRandomElement(banks),
      branchName: `${getRandomElement(['Main', 'City', 'Central', 'North', 'South'])} Branch`,
      ifsc: `${getRandomElement(banks).substring(0, 4)}${getRandomInt(10000, 99999)}`,
      accountHolderName: name,
      isBanned: false,
      createdAt: getRandomDate(new Date(2020, 0, 1), new Date())
    });
    
    const savedUser = await user.save();
    users.push(savedUser);
    console.log(`Created user: ${savedUser.name} (${savedUser.email})`);
  }
  
  return users;
};

// Generate research papers for users
const generateResearchPapers = async (users) => {
  let count = 0;
  
  for (const user of users) {
    // Generate 10-20 research papers per user
    const paperCount = getRandomInt(10, 20);
    
    for (let i = 0; i < paperCount; i++) {
      count++;
      
      // Generate 1-5 authors for each paper
      const authorCount = getRandomInt(1, 5);
      const authors = [];
      
      // Always add the main user as an author
      authors.push({
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNumber,
        isExternal: false,
        confirmationStatus: true,
        confirmationToken: {
          token: Math.random().toString(36).substring(2, 12),
          used: true
        },
        bankDetails: {
          bankName: user.bankName,
          branch: user.branchName,
          accountNo: user.bankAccount,
          ifscCode: user.ifsc
        },
        shareValue: 100 / authorCount // Equally distribute initially
      });
      
      // Generate additional authors
      for (let j = 1; j < authorCount; j++) {
        const isExternal = getRandomBool();
        authors.push({
          name: `Author ${j} of Paper ${i+1}`,
          email: `author${j}_paper${i+1}@example.com`,
          mobileNo: `9${getRandomInt(100000000, 999999999)}`,
          isExternal,
          confirmationStatus: getRandomBool(),
          confirmationToken: {
            token: Math.random().toString(36).substring(2, 12),
            used: getRandomBool()
          },
          bankDetails: {
            bankName: getRandomElement(banks),
            branch: `${getRandomElement(['Main', 'City', 'Central', 'North', 'South'])} Branch`,
            accountNo: `${getRandomInt(10000000000, 99999999999)}`,
            ifscCode: `${getRandomElement(banks).substring(0, 4)}${getRandomInt(10000, 99999)}`
          },
          shareValue: 100 / authorCount // Equally distribute initially
        });
      }
      
      // Create and save the research paper
      const year = getRandomInt(2015, 2023).toString();
      const awardCategory = getRandomElement(awardCategories);
      const totalAwardAmount = awardCategory === 'OUTSTANDING' ? 100000 : 
                               awardCategory === 'PREMIER' ? 75000 : 50000;
      
      const paper = new ResearchPaper({
        paperTitle: `Research Paper ${i+1} by ${user.name} on ${getRandomElement(['ML', 'AI', 'IoT', 'Blockchain', 'Cybersecurity', 'Big Data'])}`,
        pubYear: year,
        applicantName: user.name,
        email: user.email,
        mobileNo: user.mobileNumber,
        department: user.department,
        applicantType: user.userType,
        applicantBiography: user.applicantBiography,
        employeeId: user.employeeId,
        photograph: user.applicantPhoto,
        totalAwardAmount,
        awardCategory,
        zFactor: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)), // Between 0.5 and 1
        journalName: getRandomElement(journalNames),
        authorType: getRandomElement(authorTypes),
        impactFactor: (Math.random() * 10).toFixed(2),
        indexing: getRandomElement(indexingTypes),
        volumeNo: getRandomInt(1, 100).toString(),
        pageNo: `${getRandomInt(1, 500)}-${getRandomInt(501, 1000)}`,
        year,
        publisher: getRandomElement(publishers),
        isPaidJournal: getRandomBool() ? 'Yes' : 'No',
        paperLink: `https://doi.org/${getRandomInt(10, 99)}.${getRandomInt(1000, 9999)}/paper${count}`,
        doi: `${getRandomInt(10, 99)}.${getRandomInt(1000, 9999)}/PAPER${count}`,
        hasMorePapers: getRandomBool() ? 'Yes' : 'No',
        isEligible: getRandomBool() ? 'Yes' : 'No',
        authors,
        status: getRandomElement(paperStatuses),
        submittedAt: getRandomDate(new Date(2020, 0, 1), new Date()),
        applicantEmail: user.email
      });
      
      // Sometimes add reviewers or approvers
      if (paper.status === 'approved' || paper.status === 'underReview' || paper.status === 'rejected') {
        const otherUsers = users.filter(u => u._id.toString() !== user._id.toString());
        
        if (paper.status === 'approved') {
          paper.approvedBy = getRandomElement(otherUsers)._id;
          paper.reviewedBy = getRandomElement(otherUsers)._id;
        } else if (paper.status === 'underReview') {
          paper.reviewedBy = getRandomElement(otherUsers)._id;
        } else if (paper.status === 'rejected') {
          paper.rejectedBy = getRandomElement(otherUsers)._id;
          paper.reviewedBy = getRandomElement(otherUsers)._id;
        }
      }
      
      await paper.save();
      console.log(`Created paper: ${paper.paperTitle} for ${user.name}`);
    }
  }
  
  return count;
};

// Clear existing data
const clearDatabase = async () => {
  await User.deleteMany({});
  await ResearchPaper.deleteMany({});
  console.log('Database cleared');
};

// Main function to seed database
const seedDatabase = async () => {
  try {
    await clearDatabase();
    const users = await generateUsers(15); // Generate 15 users
    const paperCount = await generateResearchPapers(users);
    console.log(`Successfully seeded database with ${users.length} users and ${paperCount} research papers`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Execute seeding
seedDatabase();
