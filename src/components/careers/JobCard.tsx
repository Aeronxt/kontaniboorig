import { Box, VStack, Heading, Text, Badge, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Briefcase } from 'lucide-react';

interface JobCardProps {
  title: string;
  type: string;
  location: string;
  description: string;
}

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);
const MotionButton = motion(Button);

export function JobCard({ title, type, location, description }: JobCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.4)');

  return (
    <MotionBox
      as="article"
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      initial={{ boxShadow: `0 4px 6px ${shadowColor}` }}
      whileHover={{ 
        boxShadow: `0 10px 20px ${shadowColor}`,
        y: -5,
      }}
      transition={{ duration: 0.2 }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(to right, #4299E1, #805AD5)',
        borderTopRadius: 'xl',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s ease',
      }}
      _hover={{
        _before: {
          transform: 'scaleX(1)',
        }
      }}
    >
      <VStack align="start" spacing={4}>
        <Heading 
          size="md" 
          color="blue.500" 
          _dark={{ color: 'blue.300' }}
          as={motion.h3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </Heading>
        
        <HStack spacing={4} wrap="wrap">
          <MotionBadge
            display="flex"
            alignItems="center"
            colorScheme="purple"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            <Briefcase size={14} style={{ marginRight: '4px' }} />
            {type}
          </MotionBadge>
          <MotionBadge
            display="flex"
            alignItems="center"
            colorScheme="green"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            <MapPin size={14} style={{ marginRight: '4px' }} />
            {location}
          </MotionBadge>
          <MotionBadge
            display="flex"
            alignItems="center"
            colorScheme="blue"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            <Clock size={14} style={{ marginRight: '4px' }} />
            Apply by Apr 30
          </MotionBadge>
        </HStack>
        
        <Text 
          color="gray.600" 
          _dark={{ color: 'gray.300' }}
          as={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </Text>
        
        <MotionButton
          rightIcon={<ArrowRight size={16} />}
          colorScheme="blue"
          variant="outline"
          size="md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          View Position
        </MotionButton>
      </VStack>
    </MotionBox>
  );
} 