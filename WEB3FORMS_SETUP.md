# Web3Forms Integration

## Environment Variables

To enable the contact form, add the following to your `.env.local` file:

```
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

## Getting Your Access Key

1. Visit [https://web3forms.com/](https://web3forms.com/)
2. Sign up for a free account
3. Create a new form
4. Copy your Access Key
5. Paste it into `.env.local`

## Testing

After adding your access key:
1. Restart your Next.js development server
2. Navigate to the contact section
3. Fill out and submit the form
4. You should receive an email at the address you configured in Web3Forms

