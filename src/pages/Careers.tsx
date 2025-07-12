import { Box, Container, Heading, Text, SimpleGrid, VStack, useColorModeValue, Button } from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { JobCard } from '../components/careers/JobCard';
import { NewsletterSignup } from '../components/careers/NewsletterSignup';
import { ArrowDown } from 'lucide-react';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const jobs = [
  {
    title: 'Frontend Developer',
    type: 'Full-time',
    location: 'Remote / Hybrid',
    description: 'Join our team to create beautiful, responsive web applications using modern technologies.',
  },
  {
    title: 'Backend Engineer',
    type: 'Full-time',
    location: 'Remote / Hybrid',
    description: 'Build scalable backend systems and APIs to power our next-generation financial platform.',
  },
  {
    title: 'Product Designer',
    type: 'Full-time',
    location: 'Remote / Hybrid',
    description: 'Shape the future of financial technology through innovative design solutions.',
  },
];

export default function Careers() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const scrollToPositions = () => {
    const element = document.getElementById('positions');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box bg={bgColor} minH="100vh" overflow="hidden">
      {/* Hero Section */}
      <MotionBox
        style={{ opacity, y }}
        position="relative"
        height="90vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-r, blue.400, purple.500)"
      >
        <Container maxW="7xl" position="relative" zIndex={2}>
          <VStack spacing={8} align="center">
            <MotionHeading
              as="h1"
              size="4xl"
              textAlign="center"
              color="white"
              fontWeight="extrabold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Join Our Team
            </MotionHeading>
            <MotionText
              fontSize="2xl"
              textAlign="center"
              color="whiteAlpha.900"
              maxW="3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Come work with amazing people creating great things, in a culture that puts its people first.
              Ready to bring your experience and perspective to our team?
            </MotionText>
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                rightIcon={<ArrowDown />}
                size="lg"
                colorScheme="whiteAlpha"
                onClick={scrollToPositions}
                _hover={{
                  transform: 'translateY(4px)',
                }}
                transition="all 0.2s"
              >
                View Open Positions
              </Button>
            </MotionBox>
          </VStack>
        </Container>
        
        {/* Animated background gradient */}
        <MotionBox
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-r, blue.400, purple.500)"
          initial={{ opacity: 0.5 }}
          animate={{ 
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </MotionBox>

      <Container maxW="7xl" py={20}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Open Positions Section */}
          <MotionBox ref={ref} id="positions" variants={itemVariants}>
            <Heading
              as="h2"
              size="2xl"
              textAlign="center"
              mb={12}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Open Positions
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={8}
              as={motion.div}
              variants={containerVariants}
            >
              {jobs.map((job, index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <JobCard {...job} />
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* Newsletter Section */}
          <MotionBox mt={20} variants={itemVariants}>
            <NewsletterSignup />
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
} 