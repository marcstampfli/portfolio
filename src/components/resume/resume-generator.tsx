"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { type Experience } from "@prisma/client";
// TODO: Create dedicated Resume model in Prisma to enhance data structure
// - Add fields for contact info, skills, education, certifications
// - Include relationships to Experience model

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: "40 50",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    marginBottom: 25,
  },
  header: {
    borderBottom: "2px solid #2563EB",
    paddingBottom: 15,
    marginBottom: 15,
  },
  name: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    color: "#2563EB",
    marginBottom: 12,
    fontFamily: "Helvetica",
    letterSpacing: 0.3,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 30,
    marginTop: 12,
  },
  contact: {
    fontSize: 9,
    color: "#475569",
    fontFamily: "Helvetica",
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "1px solid #E2E8F0",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  jobTitleCompany: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    color: "#1E293B",
  },
  company: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 2,
    fontFamily: "Helvetica",
  },
  period: {
    fontSize: 10,
    color: "#64748B",
    fontFamily: "Helvetica",
    textAlign: "right",
  },
  description: {
    fontSize: 10,
    marginBottom: 8,
    lineHeight: 1.5,
    fontFamily: "Helvetica",
    color: "#475569",
  },
  achievements: {
    marginLeft: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  achievement: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.5,
    fontFamily: "Helvetica",
    color: "#475569",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    width: 8,
    marginRight: 4,
    color: "#2563EB",
  },
  achievementText: {
    flex: 1,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  skill: {
    fontSize: 9,
    backgroundColor: "#F1F5F9",
    padding: "4 8",
    borderRadius: 4,
    fontFamily: "Helvetica",
    color: "#2563EB",
  },
  summary: {
    fontSize: 10.5,
    lineHeight: 1.6,
    color: "#475569",
    marginBottom: 0,
    fontFamily: "Helvetica",
    paddingRight: 40,
  },
  skillsSection: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 25,
  },
  skillCategory: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 6,
    borderLeft: "3px solid #2563EB",
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#1E293B",
  },
  skillList: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.6,
  },
  links: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
  },
  link: {
    fontSize: 9,
    color: "#2563EB",
    textDecoration: "none",
    fontFamily: "Helvetica",
    flexDirection: "row",
    alignItems: "center",
  },
  linkIcon: {
    marginRight: 4,
    color: "#2563EB",
  },
  highlightBox: {
    backgroundColor: "#F1F5F9",
    padding: "15 20",
    borderRadius: 8,
    marginBottom: 25,
  },
  highlightTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2563EB",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  highlightContent: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.6,
  },
  twoColumnSection: {
    flexDirection: "row",
    gap: 25,
    marginBottom: 25,
  },
  column: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 8,
  },
  metricItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 6,
    borderBottom: "2px solid #2563EB",
  },
  metricTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#2563EB",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 9,
    color: "#475569",
    fontFamily: "Helvetica",
  },
  projectItem: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.4,
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    borderTop: "1px solid #E2E8F0",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#94A3B8",
    fontFamily: "Helvetica",
  },
  pageNumber: {
    fontSize: 8,
    color: "#94A3B8",
    fontFamily: "Helvetica",
  },
});

interface ResumeProps {
  experiences: Experience[];
  fontBuffer: ArrayBuffer | null;
}

export function Resume({ experiences }: ResumeProps) {
  // Sort experiences by start_date in descending order
  const sortedExperiences = [...experiences].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>Marc Stämpfli</Text>
            <Text style={styles.title}>
              Senior Full Stack Developer & UI Designer
            </Text>
          </View>

          <View style={styles.contactGrid}>
            <View style={styles.contact}>
              <Text>E: hello@marcstampfli.com</Text>
            </View>
            <View style={styles.contact}>
              <Text>L: Trinidad and Tobago</Text>
            </View>
            <View style={styles.contact}>
              <Text>W: marcstampfli.com</Text>
            </View>
            <View style={styles.contact}>
              <Text>Github: /marcstampfli</Text>
            </View>
            <View style={styles.contact}>
              <Text>LinkedIn: /in/marc-stämpfli</Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Professional Profile</Text>
          <Text style={styles.highlightContent}>
            Senior Full Stack Developer and UI Designer with 15+ years of
            expertise in crafting exceptional digital experiences. Specialized
            in modern web architectures, scalable applications, and intuitive
            user interfaces. Proven track record of leading technical
            initiatives and delivering high-impact solutions for
            enterprise-level projects.
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>15+</Text>
            <Text style={styles.metricLabel}>Years Experience</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>100+</Text>
            <Text style={styles.metricLabel}>Projects Delivered</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>20+</Text>
            <Text style={styles.metricLabel}>Industries Served</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>5+</Text>
            <Text style={styles.metricLabel}>Years Remote Work</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Expertise</Text>
          <View style={styles.skillsSection}>
            <View style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>
                Frontend Development
              </Text>
              <Text style={styles.skillList}>
                • React, Next.js, TypeScript{"\n"}• Modern CSS, Tailwind, Styled
                Components{"\n"}• Performance Optimization{"\n"}• Progressive
                Web Apps
              </Text>
            </View>
            <View style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>
                Backend & Infrastructure
              </Text>
              <Text style={styles.skillList}>
                • Node.js, REST/GraphQL APIs{"\n"}• PostgreSQL, Redis, Prisma
                ORM{"\n"}• Cloud Services (AWS/GCP){"\n"}• CI/CD, Docker,
                Kubernetes
              </Text>
            </View>
            <View style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>
                Design & Architecture
              </Text>
              <Text style={styles.skillList}>
                • UI/UX Design Systems{"\n"}• Microservices Architecture{"\n"}•
                System Design Patterns{"\n"}• Technical Leadership
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.twoColumnSection}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Notable Projects</Text>
            <View style={styles.projectItem}>
              <Text style={styles.projectTitle}>
                E-commerce Platform (WordHerd®)
              </Text>
              <Text style={styles.projectDescription}>
                Led development of a scalable e-commerce platform with real-time
                inventory, multi-vendor support, and advanced analytics.
              </Text>
              <View style={styles.skillsGrid}>
                <Text style={styles.skill}>Next.js</Text>
                <Text style={styles.skill}>TypeScript</Text>
                <Text style={styles.skill}>Prisma</Text>
                <Text style={styles.skill}>PostgreSQL</Text>
              </View>
            </View>
            <View style={styles.projectItem}>
              <Text style={styles.projectTitle}>
                Digital Publishing Platform (MACO)
              </Text>
              <Text style={styles.projectDescription}>
                Developed a digital magazine platform with subscription
                management, content delivery, and analytics dashboard.
              </Text>
              <View style={styles.skillsGrid}>
                <Text style={styles.skill}>React</Text>
                <Text style={styles.skill}>Node.js</Text>
                <Text style={styles.skill}>AWS</Text>
              </View>
            </View>
            <View style={styles.projectItem}>
              <Text style={styles.projectTitle}>
                Enterprise CMS (Softbox Studios)
              </Text>
              <Text style={styles.projectDescription}>
                Architected and implemented a custom CMS solution with workflow
                automation and content versioning.
              </Text>
              <View style={styles.skillsGrid}>
                <Text style={styles.skill}>WordPress</Text>
                <Text style={styles.skill}>PHP</Text>
                <Text style={styles.skill}>MySQL</Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Core Strengths</Text>
            <View style={styles.skillCategory}>
              <Text style={styles.skillList}>
                • Technical Leadership & Team Management{"\n"}• System
                Architecture & Scalability{"\n"}• Agile Development & Scrum
                {"\n"}• Cross-functional Collaboration{"\n"}• Problem-solving &
                Innovation{"\n"}• Performance Optimization{"\n"}• Security Best
                Practices{"\n"}• Remote Work Excellence
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {sortedExperiences.map((exp, index) => (
            <View
              key={exp.id}
              style={[
                styles.experienceItem,
                index === experiences.length - 1
                  ? { borderBottom: "none" }
                  : {},
              ]}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobTitleCompany}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.company}>{exp.company}</Text>
                </View>
                <Text style={styles.period}>{exp.period}</Text>
              </View>

              <Text style={styles.description}>{exp.description}</Text>

              <View style={styles.achievements}>
                {exp.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievement}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.skillsGrid}>
                {exp.tech_stack.map((tech, index) => (
                  <Text key={index} style={styles.skill}>
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            References available upon request • Portfolio: marcstampfli.com
          </Text>
          <Text style={styles.pageNumber}>
            Marc Stämpfli • Senior Full Stack Developer & UI Designer
          </Text>
        </View>
      </Page>
    </Document>
  );
}
