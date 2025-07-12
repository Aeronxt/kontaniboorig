import { Box, VStack, Heading, Text, Input, Button, useColorModeValue, useToast, HStack, Icon } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionInput = motion(Input);

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const controls = useAnimation();
  const toast = useToast();
  
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.100', 'blue.700');
  const inputBg = useColorModeValue('white', 'gray.800');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Animate success
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
      });
      
      setIsSuccess(true);
      toast({
        title: 'Subscribed!',
        description: "We'll keep you updated about new opportunities.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        icon: <CheckCircle />
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: "Something went wrong. Please try again.",
        status: 'error',
        duration: 5000,
        isClosable: true,
        icon: <AlertCircle />
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSuccess(false), 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      as="section"
      bg={bgColor}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      p={{ base: 6, md: 10 }}
      animate={controls}
    >
      <VStack spacing={6} maxW="2xl" mx="auto" textAlign="center">
        <motion.div variants={childVariants}>
          <Heading size="lg" mb={2}>Stay Updated</Heading>
          <Text>
            Subscribe to our newsletter to receive updates about new positions
            and company news.
          </Text>
        </motion.div>
        
        <Box as="form" onSubmit={handleSubmit} w="100%">
          <VStack spacing={4}>
            <MotionInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              bg={inputBg}
              required
              variants={childVariants}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            <MotionButton
              type="submit"
              colorScheme="blue"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Subscribing..."
              variants={childVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              rightIcon={
                isSuccess ? (
                  <Icon as={CheckCircle} color="green.500" />
                ) : (
                  <Icon as={Send} />
                )
              }
            >
              {isSuccess ? 'Subscribed!' : 'Subscribe'}
            </MotionButton>
          </VStack>
        </Box>
      </VStack>
    </MotionBox>
  );
} 