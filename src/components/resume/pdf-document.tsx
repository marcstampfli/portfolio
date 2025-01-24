"use client";

import type { Experience as PrismaExperience } from ".prisma/client";

interface Experience extends PrismaExperience {
  tech_stack: string[];
  achievements: string[];
}
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface PDFDocumentProps {
  experiences: Experience[];
}

export default function PDFDocument({ experiences }: PDFDocumentProps) {
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
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>Marc Stampfli</Text>
            <Text style={styles.title}>Senior Full Stack Developer</Text>
          </View>
          <View style={styles.contactGrid}>
            <Text style={styles.contact}>marc.stampfli@example.com</Text>
            <Text style={styles.contact}>+41 123 456 789</Text>
            <Text style={styles.contact}>Zurich, Switzerland</Text>
            <Text style={styles.contact}>github.com/marcstampfli</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <View style={styles.jobHeader}>
                <View style={styles.jobTitleCompany}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
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
      </Page>
    </Document>
  );
}
