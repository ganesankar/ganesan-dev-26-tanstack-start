import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { homeDataOptions } from '~/queries/home'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailIcon from '@mui/icons-material/Email'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export const Route = createFileRoute('/_public/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(homeDataOptions()),
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Home' },
      {
        name: 'description',
        content:
          import.meta.env.VITE_SITE_DESCRIPTION || 'Welcome to my portfolio',
      },
    ],
  }),
})

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Box
      component="section"
      sx={{ borderTop: 1, borderColor: 'divider' }}
    >
      <Container 
        maxWidth={false} 
        sx={{
          maxWidth: '1536px', // Tailwind 2xl container
          px: { xs: 2, sm: 3, lg: 4 }
        }}
      >
        <Grid
          container
          columnSpacing={{ xs: 0, md: 8 }}
          sx={{ py: { xs: 8, md: 12 }, rowGap: 4 }}
        >
          <Grid size={{ xs: 12, md: 'auto' }} sx={{ width: { md: 200 } }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'text.secondary',
                pt: { md: 0.5 },
                display: 'block',
                textTransform: 'uppercase'
              }}
            >
              {label}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ flex: 1 }}>{children}</Grid>
        </Grid>
      </Container>
    </Box>
  )
}

function Subsection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Grid container columnSpacing={{ xs: 0, lg: 8 }} sx={{ rowGap: 2 }}>
      <Grid size={{ xs: 12, lg: 'auto' }} sx={{ width: { lg: 200 } }}>
        <Typography
          sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem', mb: { xs: 0.5, lg: 0 } }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ flex: 1 }}>
        <Typography
          sx={{ color: 'text.secondary', lineHeight: 1.75, fontSize: '1rem' }}
        >
          {children}
        </Typography>
      </Grid>
    </Grid>
  )
}

function HomePage() {
  const { data } = useSuspenseQuery(homeDataOptions())
  const { latestPosts, latestPortfolio } = data

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Container 
        maxWidth={false} 
        sx={{
          maxWidth: '1536px',
          px: { xs: 2, sm: 3, lg: 4 }
        }}
      >
        <Grid
          container
          columnSpacing={12}
          sx={{ py: { xs: 10, md: 16 }, alignItems: 'center', rowGap: 6 }}
        >
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.875rem', md: '2.25rem', lg: '3rem' },
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              Full-stack engineer, architect{' '}
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                with 15+ years of enterprise experience in building scalable
                cloud native applications.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: '1.125rem',
                color: 'text.secondary',
                lineHeight: 1.75,
                mb: 4,
                maxWidth: '36rem' // max-w-xl
              }}
            >
              Chennai-based, focusing on AWS and Databricks currently.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                component="a"
                href="https://linkedin.com/in/ganesandev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://github.com/ganesandev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://x.com/ganesandev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                component="a"
                href="mailto:hello@example.com"
                aria-label="Email"
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                position: 'relative',
                aspectRatio: { xs: '4/3', lg: '1/1' },
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'action.hover',
              }}
            >
              <img
                src="/20250625_173326.jpg"
                alt="Ganesan Karuppaiya"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* About Me Section */}
      <Section label="About Me">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Subsection title="background">
            Fifteen years of well-rounded experience — a decade at the
            architect, lead, senior, designer, developer and mentor level.
            Started from a small startup and grew with the company to a global
            enterprise. Deep experience in retail, manufacturing, textiles,
            e-commerce, electronics, semi-conductor and real estate.
          </Subsection>

          <Subsection title="expertise">
            Full-stack development, architecture, design, development, testing,
            deployment, and maintenance of web applications. Experience with
            Cloud Platforms, Infra management with IaC. UI/UX design and
            development with Frameworks and Libraries. Solid Experience in
            Serverless Web Design &amp; Development, Accessibility, Performance,
            Security, Testing and Monitoring, Analytics &amp; Optimization.
            Recent exposure to Databricks, Spark, Python with Data Engineering
            and Analytics.
          </Subsection>

          <Subsection title="philosophy">
            A holistic mindset—caring deeply about the entire product lifecycle,
            from user interface to database, driven by curiosity and
            problem-solving rather than just a job title. Key aspects include
            versatility, ownership, continuous learning (even outside tech),
            strong communication, user-centric design, and building resilient,
            scalable systems, embracing iteration and adaptability.
          </Subsection>

          <Subsection title="execution">
            Total Ownership of full lifecycle—from UI design to cloud deployment
            on every layer is secure, performant, and cohesive. Build scalable,
            event-driven systems using modern stacks, focusing on accessibility
            and intuitive UX to solve real human problems. Driven by curiosity,
            with the ability to master core fundamentals rather than just chasing
            frameworks, often drawing problem-solving inspiration from fields
            outside of tech. Favor lean prototyping and modular architectures to
            deploy quickly, and evolve the system through continuous iteration.
          </Subsection>
        </Box>
      </Section>

      {/* At Work Section */}
      <Section label="At Work">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Subsection title="i do">
            <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 1 } }}>
              <li>
                <strong>Discovery &amp; Strategy</strong>: Defining project
                scope, analyzing requirements, and establishing technical
                roadmaps.
              </li>
              <li>
                <strong>Technical Feasibility</strong>: Evaluating architectural
                risks, cost-efficiency, and identifying optimal technology
                stacks.
              </li>
              <li>
                <strong>Architectural Design</strong>: Creating robust system
                designs, data models, and high-fidelity wireframes for scalable
                solutions.
              </li>
              <li>
                <strong>Core Development</strong>: Implementing modular,
                high-performance codebases with a focus on enterprise-grade
                architecture.
              </li>
              <li>
                <strong>Quality Engineering</strong>: Conducting rigorous testing
                across functionality, security, and performance to ensure
                reliability.
              </li>
              <li>
                <strong>Cloud Operations</strong>: Orchestrating seamless
                deployments through IaC, CI/CD, and comprehensive monitoring
                systems.
              </li>
              <li>
                <strong>System Evolution</strong>: Providing ongoing support,
                security updates, and performance tuning for long-term
                scalability.
              </li>
            </Box>
          </Subsection>

          <Subsection title="i use">
            <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 1 } }}>
              <li>
                <strong>Frontend</strong>: HTML5, CSS3, JavaScript, TypeScript,
                React, Angular, Vue, Svelte, Riot, Solid.
              </li>
              <li>
                <strong>Backend</strong>: Node.js, Express, NestJS, AWS Lambda,
                Serverless, AWS CDK, Python, Go.
              </li>
              <li>
                <strong>Testing</strong>: Jest, Chai, Cucumber, Nightwatch,
                Cypress.
              </li>
              <li>
                <strong>Cloud</strong>: SQS, Step Functions, VPC, API Gateway,
                S3, IAM, Route53, CloudFront, CloudWatch, ElastiCache.
              </li>
              <li>
                <strong>IaC</strong>: CloudFormation, AWS CDK, Terraform,
                Serverless, SST, AWS CLI.
              </li>
              <li>
                <strong>Databases</strong>: OpenSearch, DynamoDB, NeptuneDB,
                MongoDB, PostgreSQL.
              </li>
              <li>
                <strong>Messaging &amp; Caching</strong>: Kafka, Redis,
                ElastiCache.
              </li>
              <li>
                <strong>UX &amp; Design</strong>: Figma, Adobe Photoshop,
                InDesign, Illustrator.
              </li>
              <li>
                <strong>Data Engineering</strong>: Databricks, Spark, Python,
                Jupyter Notebook.
              </li>
              <li>
                <strong>Tools</strong>: Confluence, Jira, Jenkins.
              </li>
            </Box>
          </Subsection>

          <Subsection title="i create">
            <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 1 } }}>
              <li>
                <strong>Full-Stack Applications</strong>: End-to-end web
                solutions from concept to deployment.
              </li>
              <li>
                <strong>Serverless Architectures</strong>: Highly available and
                cost-effective cloud systems.
              </li>
              <li>
                <strong>Data Solutions</strong>: Automated pipelines and
                large-scale data processing systems.
              </li>
              <li>
                <strong>Distributed Systems</strong>: High-performance messaging
                and event-driven microservices.
              </li>
              <li>
                <strong>User Interfaces</strong>: Modern, accessible, and
                high-performance frontend experiences.
              </li>
              <li>
                <strong>Infrastructure as Code</strong>: Automated, reproducible,
                and secure cloud provisioning.
              </li>
            </Box>
          </Subsection>
        </Box>
      </Section>

      {/* Recent Portfolio Section */}
      {latestPortfolio.length > 0 && (
        <Section label="Recent Work">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', lineHeight: 1.75, maxWidth: 720 }}
            >
              Over the course of my career, I got privilege of collaborating with
              exceptionally talented companies and individuals, which has allowed
              me to undertake a range of interesting, difficult, and amazing
              initiatives. Still, I will call attention to some individual
              projects here; more information about the ones I created for my
              employers may be found in my resume.
            </Typography>

            {latestPortfolio.map((item) => (
              <Box
                key={item.id}
                component={Link}
                to="/portfolio/$slug"
                params={{ slug: item.slug }}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover .item-title': { color: 'primary.main' },
                }}
              >
                <Grid container spacing={{ xs: 2, lg: 4 }}>
                  <Grid size={{ xs: 12, lg: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, lg: 9 }}>
                    <Typography
                      className="item-title"
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.title}
                    </Typography>
                    {item.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mt: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Box>
              <Typography
                component={Link}
                to="/portfolio"
                variant="body2"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 500,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                View All
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Typography>
            </Box>
          </Box>
        </Section>
      )}

      {/* Writing Section */}
      <Section label="Writing">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.75,
              maxWidth: 600,
            }}
          >
            I often engage with articles across various fields, including
            technology and development. On occasion, I find the time to write,
            and the results of those efforts are listed below.
          </Typography>

          {latestPosts.length > 0 ? (
            <>
              {latestPosts.map((post) => (
                <Box
                  key={post.id}
                  component={Link}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover .post-title': { color: 'primary.main' },
                  }}
                >
                  <Grid container spacing={{ xs: 2, lg: 4 }}>
                    <Grid size={{ xs: 12, lg: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {new Date(
                          post.published_at || post.created_at,
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 9 }}>
                      <Typography
                        className="post-title"
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          transition: 'color 0.2s',
                        }}
                      >
                        {post.title}
                      </Typography>
                      {post.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            mt: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {post.description}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Box>
                <Typography
                  component={Link}
                  to="/blog"
                  variant="body2"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500,
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  View All
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              No articles yet. Check back soon!
            </Typography>
          )}
        </Box>
      </Section>

      <Box sx={{ height: 32 }} />
    </Box>
  )
}
