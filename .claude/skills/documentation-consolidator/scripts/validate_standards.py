#!/usr/bin/env python3
"""
Documentation Standards Validator

Validates documentation against excellence standards:
- Traceability: Can trace feature → code → tests
- Accuracy: Documentation matches current code state
- Completeness: All required sections present
- Discoverability: Information properly indexed

Usage:
    python3 validate_standards.py [--path /path/to/project] [--strict]
"""

import os
import sys
import re
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Set, Tuple
from collections import defaultdict


class StandardsValidator:
    def __init__(self, project_root: str, strict: bool = False):
        self.project_root = Path(project_root)
        self.agent_dir = self.project_root / ".agent"
        self.strict = strict
        self.validations = defaultdict(list)
        self.scores = {}

    def validate(self) -> Dict:
        """Run all validation checks"""
        print(f"🔍 Validating documentation standards in {self.agent_dir}")

        if not self.agent_dir.exists():
            return {"error": f".agent directory not found at {self.agent_dir}"}

        # Run validation checks
        self._validate_traceability()
        self._validate_accuracy()
        self._validate_completeness()
        self._validate_discoverability()

        return self._generate_report()

    def _validate_traceability(self):
        """Validate that features can be traced through the system"""
        print("  📍 Checking traceability...")

        reports_dir = self.agent_dir / "Reports"
        tasks_dir = self.agent_dir / "Tasks"
        system_dir = self.agent_dir / "System"

        if not reports_dir.exists():
            self.validations['traceability'].append({
                "severity": "high",
                "issue": "No Reports/ directory found",
                "impact": "Cannot trace implementation history"
            })
            self.scores['traceability'] = 0
            return

        # Get all feature reports (non-debugger, non-test)
        feature_reports = []
        for report in reports_dir.glob("*.md"):
            if "debugger" not in report.name.lower() and "test-executor" not in report.name.lower():
                feature_reports.append(report)

        if not feature_reports:
            self.validations['traceability'].append({
                "severity": "medium",
                "issue": "No feature reports found in Reports/",
                "impact": "Implementation history not documented"
            })
            self.scores['traceability'] = 30
            return

        # Check if features are referenced in tasks
        traced_features = 0
        total_features = len(feature_reports)

        for feature_report in feature_reports:
            feature_name = feature_report.stem
            is_traced = False

            # Check Tasks/ for references
            if tasks_dir.exists():
                for task_file in tasks_dir.glob("*.md"):
                    content = task_file.read_text().lower()
                    if feature_name.lower() in content:
                        is_traced = True
                        break

            # Check System/ for references
            if not is_traced and system_dir.exists():
                for sys_file in system_dir.glob("*.md"):
                    content = sys_file.read_text().lower()
                    if feature_name.lower() in content:
                        is_traced = True
                        break

            if is_traced:
                traced_features += 1
            else:
                self.validations['traceability'].append({
                    "severity": "low",
                    "issue": f"Feature '{feature_name}' not traced to Tasks or System docs",
                    "impact": "Feature implementation not linked to planning/architecture"
                })

        # Calculate traceability score
        if total_features > 0:
            self.scores['traceability'] = int((traced_features / total_features) * 100)
        else:
            self.scores['traceability'] = 100

    def _validate_accuracy(self):
        """Validate that documentation reflects current code state"""
        print("  ✓ Checking accuracy...")

        system_dir = self.agent_dir / "System"
        reports_dir = self.agent_dir / "Reports"

        if not system_dir.exists():
            self.validations['accuracy'].append({
                "severity": "high",
                "issue": "No System/ directory found",
                "impact": "System state not documented"
            })
            self.scores['accuracy'] = 0
            return

        # Check if System docs have been updated recently relative to Reports
        recent_threshold = datetime.now() - timedelta(days=14)

        recent_reports = []
        if reports_dir.exists():
            for report in reports_dir.glob("*.md"):
                if datetime.fromtimestamp(report.stat().st_mtime) > recent_threshold:
                    recent_reports.append(report)

        outdated_system_docs = 0
        total_system_docs = 0

        for sys_doc in system_dir.glob("*.md"):
            total_system_docs += 1
            last_modified = datetime.fromtimestamp(sys_doc.stat().st_mtime)

            # If there are recent reports but system doc is old
            if recent_reports and last_modified < recent_threshold:
                outdated_system_docs += 1
                self.validations['accuracy'].append({
                    "severity": "medium",
                    "issue": f"System doc '{sys_doc.name}' not updated recently",
                    "last_modified": last_modified.strftime("%Y-%m-%d"),
                    "recent_reports": len(recent_reports),
                    "impact": "May not reflect recent changes"
                })

        # Calculate accuracy score
        if total_system_docs > 0:
            up_to_date = total_system_docs - outdated_system_docs
            self.scores['accuracy'] = int((up_to_date / total_system_docs) * 100)
        else:
            self.scores['accuracy'] = 0

    def _validate_completeness(self):
        """Validate that all required documentation sections exist"""
        print("  📝 Checking completeness...")

        system_dir = self.agent_dir / "System"

        # Required files and their sections
        required_structure = {
            "project_architecture.md": {
                "sections": ["## Overview", "## Tech Stack", "## Directory Structure"],
                "min_length": 1000
            },
            "database_schema.md": {
                "sections": ["## Tables", "## Relationships"],
                "min_length": 500
            },
            "api_endpoints.md": {
                "sections": ["## Endpoints"],
                "min_length": 500
            }
        }

        if not system_dir.exists():
            self.validations['completeness'].append({
                "severity": "high",
                "issue": "System/ directory does not exist",
                "impact": "Core documentation missing"
            })
            self.scores['completeness'] = 0
            return

        total_checks = 0
        passed_checks = 0

        for doc_name, requirements in required_structure.items():
            doc_path = system_dir / doc_name
            total_checks += 1 + len(requirements['sections'])  # File + sections

            if not doc_path.exists():
                self.validations['completeness'].append({
                    "severity": "high",
                    "issue": f"Required file '{doc_name}' missing",
                    "impact": "Critical documentation not available"
                })
                continue

            passed_checks += 1  # File exists
            content = doc_path.read_text()

            # Check required sections
            for section in requirements['sections']:
                if section in content:
                    passed_checks += 1
                else:
                    self.validations['completeness'].append({
                        "severity": "medium",
                        "issue": f"Missing section '{section}' in {doc_name}",
                        "impact": "Documentation incomplete"
                    })

            # Check minimum length
            if len(content) < requirements['min_length']:
                self.validations['completeness'].append({
                    "severity": "low",
                    "issue": f"{doc_name} is sparse ({len(content)} chars, expected {requirements['min_length']}+)",
                    "impact": "Insufficient detail"
                })

        # Check for README.md
        readme_path = self.agent_dir / "README.md"
        total_checks += 1
        if readme_path.exists():
            passed_checks += 1
        else:
            self.validations['completeness'].append({
                "severity": "medium",
                "issue": ".agent/README.md missing",
                "impact": "No documentation index available"
            })

        # Calculate completeness score
        if total_checks > 0:
            self.scores['completeness'] = int((passed_checks / total_checks) * 100)
        else:
            self.scores['completeness'] = 0

    def _validate_discoverability(self):
        """Validate that information is properly indexed and organized"""
        print("  🔍 Checking discoverability...")

        readme_path = self.agent_dir / "README.md"

        if not readme_path.exists():
            self.validations['discoverability'].append({
                "severity": "high",
                "issue": "No README.md index in .agent/",
                "impact": "Documentation not indexed, hard to discover"
            })
            self.scores['discoverability'] = 0
            return

        readme_content = readme_path.read_text()

        # Check for key sections in README
        expected_sections = [
            "## System",
            "## Tasks",
            "## SOP",
            "## Reports"
        ]

        missing_sections = []
        for section in expected_sections:
            if section not in readme_content:
                missing_sections.append(section)

        if missing_sections:
            self.validations['discoverability'].append({
                "severity": "medium",
                "issue": f"README.md missing sections: {', '.join(missing_sections)}",
                "impact": "Incomplete documentation index"
            })

        # Check if README has links to docs
        has_links = bool(re.search(r'\[.*?\]\(.*?\.md\)', readme_content))
        if not has_links:
            self.validations['discoverability'].append({
                "severity": "high",
                "issue": "README.md has no links to documentation files",
                "impact": "Cannot navigate to actual documentation"
            })

        # Check if subdirectories exist
        required_dirs = ["System", "Tasks", "SOP", "Reports"]
        missing_dirs = []

        for dir_name in required_dirs:
            dir_path = self.agent_dir / dir_name
            if not dir_path.exists():
                missing_dirs.append(dir_name)

        if missing_dirs:
            self.validations['discoverability'].append({
                "severity": "high",
                "issue": f"Missing directories: {', '.join(missing_dirs)}",
                "impact": "Documentation structure incomplete"
            })

        # Calculate discoverability score
        total_checks = len(expected_sections) + 1 + len(required_dirs)  # sections + links + dirs
        passed_checks = (len(expected_sections) - len(missing_sections)) + (1 if has_links else 0) + (len(required_dirs) - len(missing_dirs))

        if total_checks > 0:
            self.scores['discoverability'] = int((passed_checks / total_checks) * 100)
        else:
            self.scores['discoverability'] = 0

    def _generate_report(self) -> Dict:
        """Generate validation report with scores"""
        total_issues = sum(len(v) for v in self.validations.values())

        # Calculate overall score
        if self.scores:
            overall_score = sum(self.scores.values()) / len(self.scores)
        else:
            overall_score = 0

        # Determine grade
        if overall_score >= 90:
            grade = "A"
        elif overall_score >= 80:
            grade = "B"
        elif overall_score >= 70:
            grade = "C"
        elif overall_score >= 60:
            grade = "D"
        else:
            grade = "F"

        report = {
            "validation_date": datetime.now().isoformat(),
            "project_root": str(self.project_root),
            "overall_score": round(overall_score, 1),
            "grade": grade,
            "scores": self.scores,
            "total_issues": total_issues,
            "issues_by_category": {k: len(v) for k, v in self.validations.items()},
            "validations": dict(self.validations)
        }

        return report


def format_validation_report(result: Dict) -> str:
    """Format validation result as readable text"""
    if "error" in result:
        return f"❌ Error: {result['error']}"

    lines = []
    lines.append("=" * 80)
    lines.append("📋 DOCUMENTATION STANDARDS VALIDATION REPORT")
    lines.append("=" * 80)
    lines.append(f"Date: {result['validation_date']}")
    lines.append(f"Project: {result['project_root']}")
    lines.append("")

    # Overall score
    grade = result['grade']
    score = result['overall_score']
    grade_emoji = {"A": "🌟", "B": "✅", "C": "⚠️", "D": "❌", "F": "💔"}.get(grade, "❓")

    lines.append(f"📊 OVERALL GRADE: {grade_emoji} {grade} ({score}%)")
    lines.append("")

    # Individual scores
    lines.append("📈 CATEGORY SCORES")
    lines.append("-" * 80)
    scores = result['scores']
    for category, score_val in scores.items():
        bar_length = int(score_val / 5)
        bar = "█" * bar_length + "░" * (20 - bar_length)
        lines.append(f"{category.title():20s} {bar} {score_val}%")

    lines.append("")
    lines.append(f"Total Issues: {result['total_issues']}")
    lines.append("")

    # Detailed issues
    validations = result['validations']

    if validations.get('traceability'):
        lines.append("📍 TRACEABILITY ISSUES")
        lines.append("-" * 80)
        for issue in validations['traceability']:
            severity_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(issue['severity'], "⚪")
            lines.append(f"{severity_emoji} {issue['severity'].upper()}: {issue['issue']}")
            lines.append(f"   Impact: {issue['impact']}")
            lines.append("")

    if validations.get('accuracy'):
        lines.append("✓ ACCURACY ISSUES")
        lines.append("-" * 80)
        for issue in validations['accuracy']:
            severity_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(issue['severity'], "⚪")
            lines.append(f"{severity_emoji} {issue['severity'].upper()}: {issue['issue']}")
            if 'last_modified' in issue:
                lines.append(f"   Last Modified: {issue['last_modified']}")
            lines.append(f"   Impact: {issue['impact']}")
            lines.append("")

    if validations.get('completeness'):
        lines.append("📝 COMPLETENESS ISSUES")
        lines.append("-" * 80)
        for issue in validations['completeness']:
            severity_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(issue['severity'], "⚪")
            lines.append(f"{severity_emoji} {issue['severity'].upper()}: {issue['issue']}")
            lines.append(f"   Impact: {issue['impact']}")
            lines.append("")

    if validations.get('discoverability'):
        lines.append("🔍 DISCOVERABILITY ISSUES")
        lines.append("-" * 80)
        for issue in validations['discoverability']:
            severity_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(issue['severity'], "⚪")
            lines.append(f"{severity_emoji} {issue['severity'].upper()}: {issue['issue']}")
            lines.append(f"   Impact: {issue['impact']}")
            lines.append("")

    lines.append("=" * 80)
    lines.append(f"✅ Validation complete - Grade: {grade} ({score}%)")
    lines.append("=" * 80)

    return "\n".join(lines)


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Validate documentation standards")
    parser.add_argument("--path", default=".", help="Path to project root (default: current directory)")
    parser.add_argument("--strict", action="store_true", help="Enable strict validation mode")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    validator = StandardsValidator(args.path, strict=args.strict)
    result = validator.validate()

    if args.json:
        import json
        print(json.dumps(result, indent=2))
    else:
        print(format_validation_report(result))

    # Exit with error code if grade is below B
    if result.get('grade') in ['C', 'D', 'F']:
        sys.exit(1)


if __name__ == "__main__":
    main()
