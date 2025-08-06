#!/usr/bin/env python3
"""
Comprehensive test for Operator Uplift app
Tests all modals, functionality, gaps, errors, and features
"""

import os
import sys
import re
from pathlib import Path

def test_story_progress_removal():
    """Test that Story Progress modal is completely removed"""
    print("🧹 Testing Story Progress Removal...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for story progress elements
    story_progress_elements = [
        'story-progress',
        'setupStoryProgression',
        'createStoryProgress',
        'setupPhaseTransitions',
        'Story Progress'
    ]
    
    removed_count = 0
    for element in story_progress_elements:
        if element not in content:
            removed_count += 1
        else:
            print(f"❌ Story progress element still found: {element}")
    
    if removed_count == len(story_progress_elements):
        print("✅ All story progress elements removed")
        return True
    else:
        print(f"❌ Only {removed_count}/{len(story_progress_elements)} elements removed")
        return False

def identify_all_modals():
    """Identify all modals in the app"""
    print("\n🔍 Identifying All Modals...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all modal IDs
    modal_pattern = r'id="([^"]*-modal)"'
    modal_ids = re.findall(modal_pattern, content)
    
    # Find all modal classes
    modal_class_pattern = r'class="[^"]*modal[^"]*"'
    modal_classes = re.findall(modal_class_pattern, content)
    
    # Find all showModal calls
    show_modal_pattern = r'showModal\([\'"]([^\'"]+)[\'"]\)'
    show_modal_calls = re.findall(show_modal_pattern, content)
    
    # Find all hideModal calls
    hide_modal_pattern = r'hideModal\([\'"]([^\'"]+)[\'"]\)'
    hide_modal_calls = re.findall(hide_modal_pattern, content)
    
    print(f"📋 Found {len(modal_ids)} modal IDs:")
    for modal_id in sorted(set(modal_ids)):
        print(f"   - {modal_id}")
    
    print(f"\n📋 Found {len(show_modal_calls)} showModal calls:")
    for call in sorted(set(show_modal_calls)):
        print(f"   - showModal('{call}')")
    
    print(f"\n📋 Found {len(hide_modal_calls)} hideModal calls:")
    for call in sorted(set(hide_modal_calls)):
        print(f"   - hideModal('{call}')")
    
    return {
        'modal_ids': modal_ids,
        'show_calls': show_modal_calls,
        'hide_calls': hide_modal_calls
    }

def test_modal_functionality():
    """Test modal functionality and identify issues"""
    print("\n🔧 Testing Modal Functionality...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Check for modal overlay
    if 'modal-overlay' in content:
        print("✅ Modal overlay found")
    else:
        issues.append("Modal overlay missing")
        print("❌ Modal overlay missing")
    
    # Check for showModal function
    if 'showModal(' in content:
        print("✅ showModal function found")
    else:
        issues.append("showModal function missing")
        print("❌ showModal function missing")
    
    # Check for hideModal function
    if 'hideModal(' in content:
        print("✅ hideModal function found")
    else:
        issues.append("hideModal function missing")
        print("❌ hideModal function missing")
    
    # Check for modal CSS
    if '.modal' in content:
        print("✅ Modal CSS found")
    else:
        issues.append("Modal CSS missing")
        print("❌ Modal CSS missing")
    
    return len(issues) == 0

def test_csp_errors():
    """Test for CSP and security issues"""
    print("\n🛡️ Testing CSP and Security Issues...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Check for CSP meta tag
    if 'Content-Security-Policy' in content:
        print("✅ CSP meta tag found")
    else:
        issues.append("CSP meta tag missing")
        print("❌ CSP meta tag missing")
    
    # Check for worker-src directive
    if 'worker-src' in content:
        print("✅ worker-src directive found")
    else:
        issues.append("worker-src directive missing (causes Tone.js errors)")
        print("❌ worker-src directive missing")
    
    # Check for connect-src issues
    if 'us-central1-*.cloudfunctions.net' in content:
        issues.append("Invalid connect-src pattern")
        print("❌ Invalid connect-src pattern found")
    else:
        print("✅ No invalid connect-src patterns")
    
    return len(issues) == 0

def test_auth_functionality():
    """Test authentication functionality"""
    print("\n🔐 Testing Authentication Functionality...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Check for auth view
    if 'auth-view' in content:
        print("✅ Auth view found")
    else:
        issues.append("Auth view missing")
        print("❌ Auth view missing")
    
    # Check for login form
    if 'login-form' in content:
        print("✅ Login form found")
    else:
        issues.append("Login form missing")
        print("❌ Login form missing")
    
    # Check for register form
    if 'register-form' in content:
        print("✅ Register form found")
    else:
        issues.append("Register form missing")
        print("❌ Register form missing")
    
    # Check for auth state management
    if 'isAuthenticated' in content:
        print("✅ Auth state management found")
    else:
        issues.append("Auth state management missing")
        print("❌ Auth state management missing")
    
    return len(issues) == 0

def test_ui_components():
    """Test UI components and layout"""
    print("\n🎨 Testing UI Components...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    components = {
        'header': 'header' in content,
        'sidebar': 'sidebar' in content,
        'main-content': 'main-content' in content,
        'dashboard': 'dashboard-view' in content,
        'goals': 'goals-view' in content,
        'ai-chat': 'ai-chat-view' in content,
        'focus': 'focus-view' in content,
        'analytics': 'analytics-view' in content,
        'settings': 'settings-view' in content
    }
    
    for component, found in components.items():
        if found:
            print(f"✅ {component} found")
        else:
            print(f"❌ {component} missing")
    
    return all(components.values())

def test_ai_integration():
    """Test AI integration features"""
    print("\n🤖 Testing AI Integration...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    ai_features = {
        'DeepSeek': 'DeepSeek' in content,
        'AI Chat': 'ai-chat' in content,
        'AI Provider': 'aiProvider' in content,
        'Personality Analysis': 'personality' in content,
        'Mood Tracking': 'mood' in content
    }
    
    for feature, found in ai_features.items():
        if found:
            print(f"✅ {feature} found")
        else:
            print(f"❌ {feature} missing")
    
    return all(ai_features.values())

def test_gamification():
    """Test gamification features"""
    print("\n🎮 Testing Gamification Features...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    gamification_features = {
        'Goals': 'goals' in content,
        'Points': 'points' in content,
        'Level': 'level' in content,
        'Streak': 'streak' in content,
        'Energy': 'energy' in content,
        'Lucky Wheel': 'lucky-wheel' in content,
        'Treasure Chest': 'treasure' in content,
        'Celebrations': 'celebrate' in content
    }
    
    for feature, found in gamification_features.items():
        if found:
            print(f"✅ {feature} found")
        else:
            print(f"❌ {feature} missing")
    
    return all(gamification_features.values())

def generate_modal_documentation():
    """Generate detailed modal documentation"""
    print("\n📚 Generating Modal Documentation...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find modal sections
    modal_sections = re.findall(r'<!-- ([^-]+) Modal -->(.*?)(?=<!--|$)', content, re.DOTALL)
    
    modal_docs = []
    for title, section in modal_sections:
        # Extract modal ID
        id_match = re.search(r'id="([^"]*)"', section)
        modal_id = id_match.group(1) if id_match else 'unknown'
        
        # Extract buttons/triggers
        buttons = re.findall(r'onclick="[^"]*showModal\([\'"]([^\'"]+)[\'"]\)[^"]*"', section)
        
        modal_docs.append({
            'title': title.strip(),
            'id': modal_id,
            'triggers': buttons
        })
    
    print("📋 Modal Documentation:")
    for doc in modal_docs:
        print(f"\n🎯 {doc['title']}")
        print(f"   ID: {doc['id']}")
        print(f"   Triggers: {', '.join(doc['triggers']) if doc['triggers'] else 'None found'}")
    
    return modal_docs

def test_mobile_responsiveness():
    """Test mobile responsiveness"""
    print("\n📱 Testing Mobile Responsiveness...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    mobile_features = {
        'Viewport Meta': 'viewport' in content,
        'Media Queries': '@media' in content,
        'Mobile Navigation': 'nav-container' in content,
        'Touch Events': 'touchstart' in content or 'touchmove' in content,
        'Responsive Grid': 'grid-template-columns' in content,
        'Flexbox': 'display: flex' in content
    }
    
    for feature, found in mobile_features.items():
        if found:
            print(f"✅ {feature} found")
        else:
            print(f"❌ {feature} missing")
    
    return all(mobile_features.values())

if __name__ == "__main__":
    print("🚀 Operator Uplift - Comprehensive App Test")
    print("=" * 60)
    
    success = True
    
    # Test story progress removal
    if not test_story_progress_removal():
        success = False
    
    # Identify all modals
    modals = identify_all_modals()
    
    # Test modal functionality
    if not test_modal_functionality():
        success = False
    
    # Test CSP issues
    if not test_csp_errors():
        success = False
    
    # Test auth functionality
    if not test_auth_functionality():
        success = False
    
    # Test UI components
    if not test_ui_components():
        success = False
    
    # Test AI integration
    if not test_ai_integration():
        success = False
    
    # Test gamification
    if not test_gamification():
        success = False
    
    # Test mobile responsiveness
    if not test_mobile_responsiveness():
        success = False
    
    # Generate modal documentation
    modal_docs = generate_modal_documentation()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 COMPREHENSIVE TEST COMPLETED!")
        print("✅ All core functionality tests passed")
    else:
        print("⚠️ SOME TESTS FAILED - Review issues above")
    
    print(f"\n📊 SUMMARY:")
    print(f"   - Modals Found: {len(set(modals['modal_ids']))}")
    print(f"   - Show Modal Calls: {len(set(modals['show_calls']))}")
    print(f"   - Hide Modal Calls: {len(set(modals['hide_calls']))}")
    print(f"   - Modal Documentation: {len(modal_docs)} modals documented")
    
    print(f"\n🔧 NEXT STEPS:")
    print(f"   1. Fix CSP issues (worker-src, connect-src)")
    print(f"   2. Test modal functionality manually")
    print(f"   3. Verify mobile responsiveness")
    print(f"   4. Test AI integration features")
    print(f"   5. Verify gamification features")
    
    print(f"\n📝 MANUAL TESTING CHECKLIST:")
    print(f"   □ Login/Register flow")
    print(f"   □ Dashboard navigation")
    print(f"   □ Modal open/close")
    print(f"   □ Mobile sidebar toggle")
    print(f"   □ AI chat functionality")
    print(f"   □ Goal creation/management")
    print(f"   □ Lucky wheel spin")
    print(f"   □ Treasure chest opening")
    print(f"   □ Mood tracking")
    print(f"   □ Settings configuration") 