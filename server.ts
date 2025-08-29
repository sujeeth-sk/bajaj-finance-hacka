import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000');

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface UserDetails {
    full_name: string;
    birth_date: string;
    email: string;
    roll_number: string;
}

interface RequestBody {
    data: (string | number)[];
}

interface ApiResponse {
    is_success: boolean;
    user_id: string;
    email: string;
    roll_number: string;
    odd_numbers: string[];
    even_numbers: string[];
    alphabets: string[];
    special_characters: string[];
    sum: string;
    concat_string: string;
}

interface ErrorResponse {
    is_success: boolean;
    error: string;
}

// User details - Update these with your actual details
const USER_DETAILS: UserDetails = {
    full_name: "john_doe", // Update with your name in lowercase
    birth_date: "17091999", // Update with your birth date in ddmmyyyy format
    email: "john@xyz.com", // Update with your email
    roll_number: "ABCD123" // Update with your roll number
};

// POST /bfhl endpoint
app.post('/bfhl', (req: Request<{}, ApiResponse | ErrorResponse, RequestBody>, res: Response<ApiResponse | ErrorResponse>) => {
    try {
        const { data } = req.body;

        // Validate input
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            });
        }

        // Initialize arrays and variables
        const odd_numbers: string[] = [];
        const even_numbers: string[] = [];
        const alphabets: string[] = [];
        const special_characters: string[] = [];
        const all_alphabet_chars: string[] = []; // Temp array for concat_string logic
        let sum: number = 0;

        // Process each item in the data array as a whole
        data.forEach((item: string | number) => {
            const str_item = String(item);

            // 1. Check if the entire item is a number
            if (!isNaN(Number(str_item)) && isFinite(Number(str_item)) && str_item.trim() !== '') {
                const num = Number(str_item);
                sum += num;

                if (num % 2 === 0) {
                    even_numbers.push(str_item);
                } else {
                    odd_numbers.push(str_item);
                }
            }
            // 2. Check if the entire item is made of alphabets
            else if (/^[a-zA-Z]+$/.test(str_item)) {
                alphabets.push(str_item.toUpperCase());
                // Add all characters from the string for the concat logic
                all_alphabet_chars.push(...str_item.split(''));
            }
            // 3. Otherwise, treat it as a special character
            else {
                special_characters.push(str_item);
            }
        });

        // Process concatenation string from all collected alphabet characters
        const reversed_chars = all_alphabet_chars.reverse();
        let concat_string = '';
        for (let i = 0; i < reversed_chars.length; i++) {
            if (i % 2 === 0) {
                concat_string += reversed_chars[i].toUpperCase();
            } else {
                concat_string += reversed_chars[i].toLowerCase();
            }
        }

        // Generate user_id
        const user_id: string = `${USER_DETAILS.full_name}_${USER_DETAILS.birth_date}`;

        // Prepare response
        const response: ApiResponse = {
            is_success: true,
            user_id: user_id,
            email: USER_DETAILS.email,
            roll_number: USER_DETAILS.roll_number,
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: sum.toString(),
            concat_string: concat_string
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// GET /bfhl endpoint (optional - for testing)
app.get('/bfhl', (req: Request, res: Response) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "BFHL API is running",
        endpoints: {
            post: "/bfhl",
            get: "/bfhl"
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

// import express, { Request, Response } from 'express';
// import cors from 'cors';

// const app = express();
// const PORT: number = parseInt(process.env.PORT || '3000');

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Types
// interface UserDetails {
//     full_name: string;
//     birth_date: string;
//     email: string;
//     roll_number: string;
// }

// interface RequestBody {
//     data: (string | number)[];
// }

// interface ApiResponse {
//     is_success: boolean;
//     user_id: string;
//     email: string;
//     roll_number: string;
//     odd_numbers: string[];
//     even_numbers: string[];
//     alphabets: string[];
//     special_characters: string[];
//     sum: string;
//     concat_string: string;
// }

// interface ErrorResponse {
//     is_success: boolean;
//     error: string;
// }

// // User details - Update these with your actual details
// const USER_DETAILS: UserDetails = {
//     full_name: "john_doe", // Update with your name in lowercase
//     birth_date: "17091999", // Update with your birth date in ddmmyyyy format
//     email: "john@xyz.com", // Update with your email
//     roll_number: "ABCD123" // Update with your roll number
// };

// // Helper function to check if a character is a number
// function isNumber(char: string): boolean {
//     return !isNaN(Number(char)) && !isNaN(parseFloat(char));
// }

// // Helper function to check if a character is an alphabet
// function isAlphabet(char: string): boolean {
//     return /^[a-zA-Z]$/.test(char);
// }

// // Helper function to check if a character is a special character
// function isSpecialCharacter(char: string): boolean {
//     return !isNumber(char) && !isAlphabet(char);
// }

// // Helper function to process concatenation string
// function processContactString(alphabets: string[]): string {
//     // Get all alphabetical characters from the input
//     const allChars: string[] = alphabets.join('').split('');
    
//     // Reverse the order
//     const reversed: string[] = allChars.reverse();
    
//     // Apply alternating caps (starting with uppercase)
//     let result: string = '';
//     for (let i = 0; i < reversed.length; i++) {
//         if (i % 2 === 0) {
//             result += reversed[i].toUpperCase();
//         } else {
//             result += reversed[i].toLowerCase();
//         }
//     }
    
//     return result;
// }

// // POST /bfhl endpoint
// app.post('/bfhl', (req: Request<{}, ApiResponse | ErrorResponse, RequestBody>, res: Response<ApiResponse | ErrorResponse>) => {
//     try {
//         const { data } = req.body;

//         // Validate input
//         if (!data || !Array.isArray(data)) {
//             return res.status(400).json({
//                 is_success: false,
//                 error: "Invalid input: 'data' must be an array"
//             });
//         }

//         // Initialize arrays and variables
//         const oddNumbers: string[] = [];
//         const evenNumbers: string[] = [];
//         const alphabets: string[] = [];
//         const specialCharacters: string[] = [];
//         let sum: number = 0;

//         // Process each item in the data array
//         data.forEach((item: string | number) => {
//             const str: string = String(item);
            
//             // Process each character in the item
//             for (let char of str) {
//                 if (isNumber(char)) {
//                     const num: number = parseInt(char);
//                     sum += num;
                    
//                     if (num % 2 === 0) {
//                         evenNumbers.push(char);
//                     } else {
//                         oddNumbers.push(char);
//                     }
//                 } else if (isAlphabet(char)) {
//                     alphabets.push(char.toUpperCase());
//                 } else if (isSpecialCharacter(char)) {
//                     specialCharacters.push(char);
//                 }
//             }
            
//             // If the entire item is a multi-digit number
//             if (isNumber(str)) {
//                 const num: number = parseInt(str);
//                 sum += num - str.split('').reduce((acc: number, digit: string) => acc + parseInt(digit), 0); // Subtract individual digits since they were already added
                
//                 if (num % 2 === 0) {
//                     evenNumbers.push(str);
//                 } else {
//                     oddNumbers.push(str);
//                 }
//             }
//         });

//         // Process concatenation string
//         const concatString: string = processContactString(alphabets);

//         // Generate user_id
//         const user_id: string = `${USER_DETAILS.full_name}_${USER_DETAILS.birth_date}`;

//         // Prepare response
//         const response: ApiResponse = {
//             is_success: true,
//             user_id: user_id,
//             email: USER_DETAILS.email,
//             roll_number: USER_DETAILS.roll_number,
//             odd_numbers: [...new Set(oddNumbers)], // Remove duplicates
//             even_numbers: [...new Set(evenNumbers)], // Remove duplicates
//             alphabets: [...new Set(alphabets)], // Remove duplicates
//             special_characters: [...new Set(specialCharacters)], // Remove duplicates
//             sum: sum.toString(), // Return as string
//             concat_string: concatString
//         };

//         res.status(200).json(response);

//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).json({
//             is_success: false,
//             error: "Internal server error"
//         });
//     }
// });

// // GET /bfhl endpoint (optional - for testing)
// app.get('/bfhl', (req: Request, res: Response) => {
//     res.status(200).json({
//         operation_code: 1
//     });
// });

// // Health check endpoint
// app.get('/', (req: Request, res: Response) => {
//     res.status(200).json({
//         message: "BFHL API is running",
//         endpoints: {
//             post: "/bfhl",
//             get: "/bfhl"
//         }
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// export default app;
